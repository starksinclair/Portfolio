"""Build flat favicon assets from the dripping S concept in docs/brand.
The same cubic paths drive SVG and supersampled PNG/ICO output.
Run npm run icons. Requires Pillow.
"""
from PIL import Image, ImageDraw
from pathlib import Path
import sys

BG = '#66023C'
FG = '#FCF9FA'
# Coordinates on a 100-unit square. Broad counters survive favicon sizing.
SHAPES = [
    [('M',72,18),('L',43,18),('C',16,18,16,54,43,54),
     ('L',56,54),('C',70,54,70,73,56,73),('L',26,73),
     ('L',26,81),('C',26,82,28,82,28,84),('L',28,86),
     ('C',28,88,30,88,30,86),('L',30,84),('C',30,83,31,82,33,82),
     ('L',56,82),('C',82,82,82,45,56,45),('L',43,45),
     ('C',28,45,28,27,43,27),('L',67,27),
     ('C',69,27,69,28,69,29),('L',69,31),('C',69,33,71,33,71,31),
     ('L',71,29),('C',71,27,72,27,72,26),('L',72,18)],
    [('M',70,34),('C',67,38,66,39,67,41),('C',68,44,72,44,73,41),('C',74,39,72,36,70,34)],
    [('M',29,89),('C',26,93,25,94,26,96),('C',27,99,31,99,32,96),('C',33,94,31,91,29,89)],
]
# Centre the artwork and leave room for app-icon masking.
def transformed(shapes, ratio):
    return [[(c[0], *[(v-50)*ratio+50 for v in c[1:]]) for c in shape] for shape in shapes]

def svg():
    paths = ''.join('<path d="'+' '.join(c[0]+' '+ ' '.join(str(v) for v in c[1:]) for c in s)+' Z"/>' for s in transformed(SHAPES,.88))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Sinclair Nzenwata: dripping S"><title>Sinclair Nzenwata: dripping S</title><rect width="100" height="100" rx="18" fill="{BG}"/><g fill="{FG}">{paths}</g></svg>\n'

def tile(size, ratio=.88, rounded=True):
    scale=size*8/100
    im=Image.new('RGBA',(size*8,size*8))
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((0,0,size*8-1,size*8-1),radius=size*8*.18 if rounded else 0,fill=BG)
    for shape in transformed(SHAPES,ratio):
        points=[]
        for cmd in shape:
            if cmd[0] in ('M','L'):
                p=(cmd[1],cmd[2]); points.append(p)
            else:
                x,y=p
                for i in range(1,33):
                    t=i/32; u=1-t
                    points.append((u**3*x+3*u*u*t*cmd[1]+3*u*t*t*cmd[3]+t**3*cmd[5],u**3*y+3*u*u*t*cmd[2]+3*u*t*t*cmd[4]+t**3*cmd[6]))
                p=(cmd[5],cmd[6])
        d.polygon([(x*scale,y*scale) for x,y in points],fill=FG)
    return im.resize((size,size),Image.Resampling.LANCZOS)

out=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parent.parent/'public'
out.mkdir(parents=True,exist_ok=True)
(out/'icon.svg').write_text(svg())
frames=[tile(n) for n in (48,32,16)]
frames[0].save(out/'favicon.ico',sizes=[(48,48),(32,32),(16,16)],append_images=frames[1:])
for n,name in [(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')]:
    tile(n,.70,False).convert('RGB').save(out/name,optimize=True)
print('Built SVG, ICO (16/32/48), Apple (180), and maskable PNG (192/512) icons.')
