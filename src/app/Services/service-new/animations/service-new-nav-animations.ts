import { trigger, state, style, transition, animate, animateChild, query } from '@angular/animations';


export const onClickNavItem = trigger('onClickNavItem', [
  state('clicked',
    style({
      'margin-left': '0px'
    })
  ),
  transition('* => clicked', animate('250ms ease-in')),
]);

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'margin': '0 5px 0 0',
      'width': '45px',
    })
  ),
  state('open',
    style({
      'margin-left': '0px',
      'min-width': '200px',
      'width': 'inherit',
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const onPageReady = trigger('onPageReady', [
  state('inactive',
    style({
      opacity: 0.4
    })
  ),
  state('active',
    style({
      opacity: 1
    })
  ),
  transition('inactive => active', animate('250ms ease-in')),
  transition('active => inactive', animate('250ms ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': '62px'
    })
  ),
  state('open',
    style({
      'margin-left': '200px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const animateText = trigger('animateText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      'display': 'block',
      'margin-left': '5px',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);

export const animateBackText = trigger('animateBackText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      'display': 'inline-block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);