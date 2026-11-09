import sys
def mark(sw=222, ex=128, ey=1150, fill='#00733a'):
    return f'<g fill="{fill}"><circle cx="476.5" cy="476.5" r="476.5"/><circle cx="1514.5" cy="668" r="327"/><circle cx="1194" cy="268" r="124.5"/><circle cx="1524" cy="124.5" r="124.5"/><circle cx="1851" cy="268" r="124.5"/></g><path d="M{ex:g} {ey:g}A1300 1300 0 0 0 {2000-ex:g} {ey:g}" fill="none" stroke="{fill}" stroke-width="{sw:g}" stroke-linecap="round"/>'
if __name__=='__main__':
    sw,ex,ey=map(float,sys.argv[1:4])
    print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1590" width="2000" height="1590">{mark(sw,ex,ey)}</svg>')
