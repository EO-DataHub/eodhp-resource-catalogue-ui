import { useState } from 'react';

import { PiCopyLight } from 'react-icons/pi';
import { TiTick } from 'react-icons/ti';
import { Tooltip } from 'react-tooltip';

import './ClipboardButton.scss';

const TIMEOUT = 1500;
const CLIPBOARD = 'clipboard';

const copyTextToClipboard = async (text) => {
  if (CLIPBOARD in navigator) {
    return await navigator.clipboard.writeText(text);
  }
};

type ClipboardButtonProps = {
  text: string;
};

export const ClipboardButton = ({ text }: ClipboardButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (event) => {
    event.stopPropagation();

    copyTextToClipboard(text)
      .then(() => {
        // If successful, update the `isCopied` state value.
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), TIMEOUT);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="clipboard">
      <Tooltip id="copy-button" />
      <button
        className="btn"
        data-tooltip-content="Copy URL to clipboard"
        data-tooltip-id="copy-button"
        onClick={handleCopy}
      >
        {isCopied ? <TiTick className="copied" /> : <PiCopyLight />}
      </button>
    </div>
  );
};
