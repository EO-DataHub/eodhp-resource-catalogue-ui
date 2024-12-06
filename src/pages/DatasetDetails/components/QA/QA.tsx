import React, { useEffect, useState } from 'react';
import './styles.scss';

import * as $rdf from 'rdflib';

import PerformanceSpec from './PerformanceSpec';
import ontology from './qa-ontology.ttl?raw';

const QA = () => {
  const [headers, setHeaders] = useState<string[]>([]);

  const parsePrefixes = () => {
    const prefixRegex = /@prefix\s+(\w+):\s+<([^>]+)>/g;
    const prefixes: { [key: string]: string } = {};
    let match;

    while ((match = prefixRegex.exec(ontology)) !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, prefix, uri] = match;
      prefixes[prefix] = uri;
    }

    return prefixes;
  };

  useEffect(() => {
    const prefixes = parsePrefixes();
    const store = $rdf.graph();
    $rdf.parse(ontology, store, 'file://./qa-ontology.ttl', 'text/turtle');

    const RDF = $rdf.Namespace(prefixes['rdf']);
    const DQV = $rdf.Namespace(prefixes['dqv']);

    // Query all entities of type dqv:Metric
    const metrics = store.match(null, RDF('type'), DQV('Metric'));

    const _headers = metrics.map((metric) => {
      const fullUri = metric.subject.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, uri] of Object.entries(prefixes)) {
        if (fullUri.startsWith(uri)) {
          return fullUri.replace(uri, ``);
        }
      }
      return fullUri;
    });

    setHeaders(_headers);
  }, []);

  return (
    <div>
      <PerformanceSpec data={[{ header: 'Wow' }]} />
    </div>
  );
};

export default QA;
