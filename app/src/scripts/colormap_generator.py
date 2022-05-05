
from matplotlib.pyplot import figure
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["figure.figsize"] = (3, 1)

x = [0,1]
y = x
# Set range and colormap you want here
z = [0, 1100]
colormap = "jet"

plt.figure()
mpb = plt.scatter(x, y, c=z, cmap=colormap)

fig,ax = plt.subplots()
plt.colorbar(mpb,ax=ax, orientation="horizontal")
ax.remove()
plt.savefig(
    'colorlegend.png',
    bbox_inches='tight',
    dpi=100
)