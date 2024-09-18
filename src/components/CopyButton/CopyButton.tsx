import { useEffect, useState } from 'react';

import { FaRegCopy } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

type CopyButtonProps = {
  copyLink: string;
  title: string;
};

const CopyButton = ({ copyLink, title }: CopyButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Handler for copy button
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (copyLink) {
      navigator.clipboard
        .writeText(copyLink)
        .then(() => {
          setShowTooltip(true);
        })
        .catch((err) => {
          console.error('Failed to copy link:', err);
        });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTooltip) {
      timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000); // Tooltip visible for 2 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showTooltip]);

  return (
    <>
      <button
        className="toolbox-row__copy-link"
        data-tooltip-content={'Copied'}
        data-tooltip-id={`copyTooltip-${title}`}
        type="button"
        onClick={handleCopy}
      >
        <FaRegCopy />
      </button>
      <Tooltip id={`copyTooltip-${title}`} isOpen={showTooltip} />
    </>
  );
};

export default CopyButton;
