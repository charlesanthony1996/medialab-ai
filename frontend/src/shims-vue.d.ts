declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  export default component;
}
