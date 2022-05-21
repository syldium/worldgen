const BASE_URL = import.meta.env ? import.meta.env.BASE_URL : '/';

function pathname() {
  return import.meta.env.SSR ? '' : window.location.pathname;
}

function addStartingSlash(path: string) {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return path;
}

export function currentPath(path = pathname()) {
  if (path.startsWith(BASE_URL)) {
    path = path.substring(BASE_URL.length);
  }
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  return addStartingSlash(path);
}

export function relativePath(path: string, current = currentPath()) {
  if (path.startsWith('/')) {
    return BASE_URL + path.substring(1);
  }
  const sep = current.lastIndexOf('/');
  return addStartingSlash(
    (sep === -1 ? '' : current.substring(0, sep + 1)) + path
  );
}

export function isActive(route: string, pattern: string): boolean {
  if (pattern === '/' && route !== pattern) {
    return false;
  }
  return (
    route.startsWith(pattern) &&
    (route.length === pattern.length || route[pattern.length] === '/')
  );
}

export function routeLink(link: HTMLAnchorElement) {
  link.blur();
  route(link.getAttribute('href')!);
}

export function navigate(url: string) {
  route(relativePath(url));
}

function route(url: string) {
  window.history.replaceState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
