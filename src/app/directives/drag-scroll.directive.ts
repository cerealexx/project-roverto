import { Directive, ElementRef, HostListener, ViewChild } from '@angular/core';

@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective {
  @ViewChild ('terrain-wrapper', {static: true}) terrain?: ElementRef;
  private _position = { top: 0, left: 0, x: 0, y: 0 };
  private _grabbing = false;

  constructor(private _elRef: ElementRef) { }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    const el = this._elRef.nativeElement;
    this._grabbing = true;
    this._elRef.nativeElement.classList.add('grabbing');

    this._position = {
      left: el.scrollLeft,
      top: el.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };
    console.log(this._position);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this._grabbing) {
      const el = this._elRef.nativeElement;
      const dx = event.clientX - this._position.x;
      const dy = event.clientY - this._position.y;

      el.scrollTop = this._position.top - dy;
      el.scrollLeft = this._position.left - dx;
    }
  }

  @HostListener('mouseup') onMouseUp(): void {
    this._elRef.nativeElement.classList.remove('grabbing');
    this._grabbing = false;
  }

}
