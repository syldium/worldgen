export function animate(...ids: readonly string[]) {
  for (const id of ids) {
    (document.getElementById(id) as unknown as SVGAnimationElement)
      .beginElement();
  }
}
