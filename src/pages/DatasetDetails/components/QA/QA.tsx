import React, { useEffect, useState } from 'react';
import './styles.scss';

import n3 from 'n3';

import { formatDate } from '@/utils/date';

import PerformanceSpec from './PerformanceSpec';
import ontology from './qa-ontology.ttl?raw';
import trig from './qa-output-1.trig?raw';
import { PerformanceSpecRow, QuadAttribute } from './types';

const Qa = () => {
  const [data, setData] = useState<PerformanceSpecRow[]>();
  const [prefixes, setPrefixes] = useState<{ [key: string]: string }>();

  useEffect(() => {
    const prefixRegex = /@prefix\s+(\w+):\s+<([^>]+)>/g;
    const prefixes: { [key: string]: string } = {};
    let match;

    while ((match = prefixRegex.exec(ontology)) !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, prefix, uri] = match;
      prefixes[prefix] = uri;
    }
    while ((match = prefixRegex.exec(trig)) !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, prefix, uri] = match;
      prefixes[prefix] = uri;
    }

    setPrefixes(prefixes);
  }, []);

  const getQuadsFromRawData = async (data: string): Promise<n3.Quad[]> => {
    return new Promise((resolve) => {
      const parser = new n3.Parser();
      const quads = [];

      parser.parse(data, (error, quad) => {
        if (error) {
          console.error('Parsing error:', error);
        } else if (quad) {
          quads.push(quad);
        } else {
          resolve(quads);
        }
      });
    });
  };

  const filterQuads = (
    quads: n3.Quad[],
    predicate: string,
    object: string,
  ): n3.DataFactory.namedNode[] => {
    const rdfType = n3.DataFactory.namedNode(predicate);
    const dqvQualityMeasurement = n3.DataFactory.namedNode(object);

    return quads
      .filter((quad) => quad.predicate.equals(rdfType) && quad.object.equals(dqvQualityMeasurement))
      .map((quad) => quad.subject);
  };

  const getAttributesForSubject = (subjectUri: string, quads: n3.Quad[]): QuadAttribute[] => {
    const subjectNode = n3.DataFactory.namedNode(subjectUri);

    const attributes = quads.filter((quad) => quad.subject.equals(subjectNode));

    return attributes.map((quad) => ({
      predicate: quad.predicate.value,
      object: quad.object.value,
    }));
  };

  const extractValue = (attributes: QuadAttribute[], value: string) => {
    const valueAttr = attributes.filter((attr) => {
      let a = '';
      Object.values(prefixes).forEach((prefix) => {
        if (attr.predicate === `${prefix}${value}`) {
          a = attr.object;
        }
      });
      return a;
    })[0];
    return valueAttr.object;
  };

  useEffect(() => {
    if (!prefixes) return;
    const func = async () => {
      const ontologyQuads = await getQuadsFromRawData(ontology);
      const trigQuads = await getQuadsFromRawData(trig);
      const filteredQuads = filterQuads(
        trigQuads,
        `${prefixes['rdf']}type`,
        `${prefixes['dqv']}QualityMeasurement`,
      );
      const attrs = getAttributesForSubject(filteredQuads[0].id, trigQuads);
      const value = extractValue(attrs, 'value');
      const computedOn = extractValue(attrs, 'isMeasurementOf');
      const computedAttrs = getAttributesForSubject(computedOn, ontologyQuads);
      const prefLabel = extractValue(computedAttrs, 'prefLabel');

      const data: PerformanceSpecRow[] = [
        {
          metric: prefLabel,
          lastChecked: formatDate(new Date()),
          result: 'yes',
          value: value,
          verified: 'true',
        },
      ];
      setData(data);
    };
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefixes]);

  return (
    <div>
      <PerformanceSpec data={data} />
    </div>
  );
};

export default Qa;
