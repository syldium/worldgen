import { useEffect } from 'react';
import { useDarkMode } from '../../hook/useDarkMode';
import { animate } from '../../util/AnimationHelper';

export function DarkModeToggle(): JSX.Element {
  const darkMode = useDarkMode();

  useEffect(() => {
    if (darkMode.value) {
      animate('rays-anim-hide', 'core-anim-enlarge', 'eclipse-anim-come');
    } else {
      animate(
        'eclipse-anim-go',
        'core-anim-shrink',
        'rays-anim-rotate',
        'rays-anim-show'
      );
    }
  }, [darkMode.value]);

  // https://github.com/mahozad/theme-switch/blob/main/src/icon.html
  // dprint-ignore
  return (
    <div className="dark-mode-toggle" title="Dark mode toggle">
      <button type="button" onClick={darkMode.toggle}>
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="mask">
              <rect width="100%" height="100%" fill="#fff"/>
              <circle id="eclipse" r="10" cy="6">
                <animate id="eclipse-anim-come" fill="freeze" attributeName="cx" to="20" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
                <animate id="eclipse-anim-go" fill="freeze" attributeName="cx" to="33" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
              </circle>
            </mask>
          </defs>
          <g id="visible-content" mask="url(#mask)">
            <g id="rays" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
              <animate id="rays-anim-hide" fill="freeze" attributeName="opacity" to="0" dur="100ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
              <animate id="rays-anim-show" fill="freeze" attributeName="opacity" to="1" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
              <animateTransform id="rays-anim-rotate" attributeName="transform" attributeType="XML" type="rotate" from="-25 12 12" to="0 12 12" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
              <path d="M12 1v3M23 12h-3M19.778 4.2218l-2.121 2.1213M19.778 19.778l-2.121-2.121M4.222 19.778l2.121-2.121M4.222 4.222l2.121 2.121M4 12H1M12 20v3"/>
            </g>
            <circle id="circle" cx="12" cy="12">
              <animate id="core-anim-enlarge" fill="freeze" attributeName="r" to="10" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
              <animate id="core-anim-shrink" fill="freeze" attributeName="r" to="5" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            </circle>
          </g>
        </svg>
      </button>
    </div>
  );
}
