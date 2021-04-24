import {HostListener, Inject, Injectable, OnDestroy, Renderer2, RendererFactory2} from '@angular/core';
import {fromEventPattern, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export enum WindowSizeBreakpoint {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl
}

@Injectable({
  providedIn: 'root'
})
export class SizeDetectorService implements OnDestroy {
  private destroy$ = new Subject();
  public onResize$: Observable<WindowSizeBreakpoint>;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private rendererFactory2: RendererFactory2) {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.createResizeObservable(renderer);
  }

  private wrapOnResizeHandler(handler: (sizeBreakpoint: WindowSizeBreakpoint) => void): (e: Event) => void {
    return (e: Event) => {
      console.log(e);
      // @ts-ignore
      handler(this.getSizeBreakpoint(e.target.innerWidth));
    };
  }

  private createResizeObservable(renderer: Renderer2): void {
    let removeResizeEventListener: () => void;
    const createResizeEventListener = (handler: (sizeBreakpoint: WindowSizeBreakpoint) => boolean | void) => {
      removeResizeEventListener = renderer.listen('window', 'resize', this.wrapOnResizeHandler(handler));
    };

    this.onResize$ = fromEventPattern<WindowSizeBreakpoint>(
      createResizeEventListener,
      () => removeResizeEventListener()
    ).pipe(takeUntil(this.destroy$));
  }

  private getSizeBreakpoint(windowWidth: number): WindowSizeBreakpoint {
    if (windowWidth < 576) {
      return WindowSizeBreakpoint.xs;
    } else if (windowWidth < 768) {
      return WindowSizeBreakpoint.sm;
    } else if (windowWidth < 992) {
      return WindowSizeBreakpoint.md;
    } else if (windowWidth < 1200) {
      return WindowSizeBreakpoint.lg;
    } else if (windowWidth < 1400) {
      return WindowSizeBreakpoint.xl;
    } else {
      return WindowSizeBreakpoint.xxl;
    }
  }

  public getCurrentSizeBreakpoint(): WindowSizeBreakpoint {
    return this.getSizeBreakpoint(window.innerWidth);
  }
}
