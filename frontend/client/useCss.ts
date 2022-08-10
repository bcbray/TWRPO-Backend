import React from 'react';
import { create, NanoRenderer } from 'nano-css';
import { addon as addonCSSOM, CSSOMAddon } from 'nano-css/addon/cssom';
import { addon as addonVCSSOM, VCSSOMAddon } from 'nano-css/addon/vcssom';
import { cssToTree } from 'nano-css/addon/vcssom/cssToTree';
import { useMemo } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';

type Nano = NanoRenderer & CSSOMAddon & VCSSOMAddon;
const nano = create() as Nano;
addonCSSOM(nano);
addonVCSSOM(nano);

const useClassName = (): string => {
  return `react-use-css-${React.useId().replaceAll(':','')}`
}

const useCss = (css: object): string => {
  const className = useClassName();
  const sheet = useMemo(() => new nano.VSheet(), []);

  useIsomorphicLayoutEffect(() => {
    const tree = {};
    cssToTree(tree, css, '.' + className, '');
    sheet.diff(tree);

    return () => {
      sheet.diff({});
    };
  });

  return className;
};

export default typeof window !== 'undefined' ? useCss : useClassName;
