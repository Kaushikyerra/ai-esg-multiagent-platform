declare module 'html2canvas' {
  interface Options {
    scale?: number
    useCORS?: boolean
    backgroundColor?: string | null
    logging?: boolean
    [key: string]: unknown
  }
  function html2canvas(element: HTMLElement, options?: Options): Promise<HTMLCanvasElement>
  export default html2canvas
}
