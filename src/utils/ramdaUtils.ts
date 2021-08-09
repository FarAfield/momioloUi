import * as R from 'ramda';

/**
 * 数组字段映射
 * 例如 [{ a:'111', b:'222', c:'333'}]   { a:'A', b:'B', d:'D'}   =>  [{ A:'111', B: '222',c:'333' }]
 */
export const mappingPropsToData = R.curry((sourceData: Array<any>, mapObj: object) =>
  R.map((i: object) =>
    R.reduce(
      (acc: object, key: string) =>
        R.ifElse(
          R.pipe(R.keys, R.includes(key)),
          R.pipe(R.assoc(R.prop(key, mapObj), R.prop(key, acc)), R.dissoc(key)),
          R.identity,
        )(acc),
      i,
      R.keys(mapObj),
    ),
  )(sourceData),
);
