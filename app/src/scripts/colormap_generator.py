#!/usr/bin/python
"""
Helper script to generate legend images from JSON configuration

Usage:
docker run --rm -it -v $PWD:/working -v $PWD/../../public:/public lubojr/matplotlib-python:mt-3.6-py3.10 python3 /working/colormap_generator.py
If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""
import os
import shutil
import matplotlib.pyplot as plt
from matplotlib.colors import (
    LogNorm,
    ListedColormap,
    LinearSegmentedColormap,
)
from matplotlib import cm
import json
from matplotlib.ticker import ScalarFormatter
import numpy as np


def clear_folder(target_dir):
    with os.scandir(target_dir) as entries:
        for entry in entries:
            if entry.is_dir() and not entry.is_symlink():
                shutil.rmtree(entry.path)
            else:
                os.remove(entry.path)


with open("/public/legends/legends.json", "r") as fh:
    data = json.load(fh)
# prepare a special legend cfastie (NDVI), as its not in matplotlib
cfastie = np.load("/public/legends/cfastie.npy")
cfastie_prepared = [
    [
        i / 255,
        [rgbadef / 255 for rgbadef in step],
    ]
    for i, step in enumerate(cfastie)
]
cm.register_cmap(
    name="cfastie", cmap=LinearSegmentedColormap.from_list("cfastie", cfastie_prepared)
)

for instance in data:
    clear_folder(f"/public/legends/{instance}")
    content = data[instance]
    for legendId in content:
        # extract from config with defaults
        config = content[legendId]
        zrange = config.get("range", [0, 1])
        colors = config.get("cm", "YlGn")
        label = config.get("label", "")
        logarithmic = config.get("logarithmic", False)
        ticks = config.get("ticks", None)
        tickLabels = config.get("tickLabels", None)
        discrete = config.get("discrete", False)

        normalization = LogNorm() if logarithmic else None
        if isinstance(colors, list):
            # expecting that colors is input as a list of discrete values (hex codes)
            if isinstance(colors[0], str):
                # list of hex strings, pass
                pass
            else:
                # list of numbers, assuming 0-255 color range from SH evalscript
                # and minmax in absolute values instead of stretched to 0,1
                if len(colors[0]) == 2:
                    # format [1740, [0, 108, 211, 120]] - not equidistant between colors definition points
                    diff = zrange[1] - zrange[0]
                    colors = [
                        [
                            (segmentdata[0] - zrange[0]) / diff,
                            [rgbadef / 255 for rgbadef in segmentdata[1]],
                        ]
                        for segmentdata in colors
                    ]
                else:
                    # format [0, 108, 211, 120] - equidistant between colors definition points
                    colors = [
                        [rgbadef / 255 for rgbadef in segmentdata[1]]
                        for segmentdata in colors
                    ]
            if discrete:
                cmap = ListedColormap(colors)
            else:
                cmap = LinearSegmentedColormap.from_list("cmap", colors)
        else:
            cmap = colors

        # generate the legend
        plt.rcParams["figure.figsize"] = (4, 2)
        x = [0, 1]
        y = x
        plt.figure()
        mpb = plt.scatter(x, y, c=zrange, cmap=cmap, norm=normalization)

        fig, ax = plt.subplots()
        cbar = plt.colorbar(mpb, ax=ax, orientation="horizontal")
        # special handling of pre-configured ticks
        if ticks:
            cbar.ax.set_xticks(ticks)
            cbar.ax.set_xticklabels([str(i) for i in tickLabels or ticks])
            # default for logarithmic ticks is 10^x notation, set scalar
            if logarithmic:
                cbar.ax.xaxis.set_major_formatter(ScalarFormatter())
        cbar.set_label(label, rotation=0)
        ax.remove()
        # save the legend
        plt.savefig(
            f"/public/legends/{instance}/{legendId}.png", bbox_inches="tight", dpi=200
        )
        plt.close()
