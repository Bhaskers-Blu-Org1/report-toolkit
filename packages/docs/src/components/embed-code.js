import React from 'react';

import Code from '../gatsby-theme-carbon/components/Code';
import {useTextFile} from '../util/hooks';

const EmbedCode = ({name, language, path, src}) => {
  const data = useTextFile();
  const shouldWrap =
    String(data[name].content)
      .trim()
      .split('\n').length === 1;

  return (
    <Code className={language} path={path} src={src} wrap={shouldWrap}>
      {data[name].content}
    </Code>
  );
};

export default EmbedCode;
