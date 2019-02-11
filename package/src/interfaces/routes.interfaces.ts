/**
 * Describes a base route
 */
export interface RootRoute {
  root: RootRouteNote;
}

/**
 * Describes a basic route note
 * and other optional parameters
 */
export interface RouteNote<C = {}> {
  path: string;
  id?: number;
  lazyPath?: string;
  component?: any;
  children?: RoutesNotes<C>;
  state?: string[];
}

/**
 * Describes a root note
 * and other optional parameters
 */
export interface RootRouteNote<C = {}> {
  path?: string;
  id?: number;
  lazyPath?: string;
  component?: any;
  children?: RoutesNotes<C>;
  state?: string[];
}

/**
 * Describes an object of basic routes
 */
export type RoutesNotes<R, C = {}> = {
  [key in keyof R]: RouteNote<C> | RootRouteNote<C>
};
