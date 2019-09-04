import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ATTRS, QueryParamsHandling } from './helpers';
import { Params } from '../interfaces';
import { insertHrefParams } from '../utils/state';
import { getRouteHref, getRouteLink } from '../utils/link';
import { checkAttrActivity } from '../utils/helpers';
import { forwardParams } from '../functions/forward-params';

@Directive({
  selector: `a[${ATTRS.LINK}],area[${ATTRS.LINK}]`
})
export class NavigationLinkWithHref {
  @HostBinding('attr.target') @Input() target!: string;
  @Input() queryParams: { [k: string]: any } = {};
  @Input() queryParamsHandling: QueryParamsHandling = '';
  @Input() fragment!: string;
  @Input() preserveFragment!: boolean;
  @Input() skipLocationChange!: boolean;
  @Input() replaceUrl!: boolean;
  @Input() state?: { [k: string]: any };
  @Input(ATTRS.PARAMS) params: Params;

  @Input() set navLink(value: string | string[]) {
    this.link = getRouteLink(value);
    const originalHref = getRouteHref(this.link);
    this.href = insertHrefParams(originalHref, this.params);
  }

  @HostBinding()
  public href: string;
  public link: string[];

  constructor(private router: Router) {}

  // tslint:disable:max-line-length
  @HostListener('click', [
    '$event.button',
    '$event.ctrlKey',
    '$event.metaKey',
    '$event.shiftKey'
  ])
  public onClick(
    button: number,
    ctrlKey: boolean,
    metaKey: boolean,
    shiftKey: boolean
  ): boolean {
    if (
      button !== 0 ||
      ctrlKey ||
      metaKey ||
      shiftKey ||
      (typeof this.target === 'string' && this.target !== '_self')
    ) {
      return true;
    }

    const extras = {
      skipLocationChange: checkAttrActivity(this.skipLocationChange),
      replaceUrl: checkAttrActivity(this.replaceUrl),
      queryParams: this.queryParams,
      queryParamsHandling: this.queryParamsHandling,
      state: this.state
    };
    const link = this.params
      ? forwardParams(this.link, this.params)
      : this.link;
    this.router.navigate(link, extras).catch(console.error);
    return false;
  }
}
