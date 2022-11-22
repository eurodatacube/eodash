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
from matplotlib.colors import LogNorm, ListedColormap, LinearSegmentedColormap
import json
from matplotlib.ticker import ScalarFormatter


def clear_folder(target_dir):
    with os.scandir(target_dir) as entries:
        for entry in entries:
            if entry.is_dir() and not entry.is_symlink():
                shutil.rmtree(entry.path)
            else:
                os.remove(entry.path)


with open("/public/legends/legends.json", "r") as fh:
    data = json.load(fh)

for instance in data:
    clear_folder(f"/public/legends/{instance}")
    content = data[instance]
    for legendId in content:
        # extract from config with defaults
        config = content[legendId]
        zrange = config.get("range", [0, 1])
        colormap = config.get("cm", "YlGn")
        label = config.get("label", "")
        logarithmic = config.get("logarithmic", False)
        ticks = config.get("ticks", None)
        discrete = config.get("discrete", False)

        normalization = LogNorm() if logarithmic else None
        if isinstance(colormap, list):
            # expecting that colormap is input as a list of discrete values (hex codes)
            if isinstance(colormap[0], str):
                # list of hex strings, pass
                pass
            else:
                # list of numbers, assuming 0-255 color range from SH evalscript
                # and minmax in absolute values instead of stretched to 0,1
                if len(colormap[0]) == 2:
                    # format [1740, [0, 108, 211, 120]] - not equidistant between colormap definition points
                    diff = zrange[1] - zrange[0]
                    colormap = [
                        [
                            (segmentdata[0] - zrange[0]) / diff,
                            [rgbadef / 255 for rgbadef in segmentdata[1]],
                        ]
                        for segmentdata in colormap
                    ]
                else:
                    # format [0, 108, 211, 120] - equidistant between colormap definition points
                    colormap = [
                        [rgbadef / 255 for rgbadef in segmentdata[1]]
                        for segmentdata in colormap
                    ]
            if discrete:
                cmap = ListedColormap(colormap)
            else:
                cmap = LinearSegmentedColormap.from_list("cmap", colormap)
        else:
            cmap = colormap

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
            cbar.ax.set_xticklabels([str(i) for i in ticks])
            # default for logarithmic ticks is 10^x notation, set scalar
            if logarithmic:
                cbar.ax.xaxis.set_major_formatter(ScalarFormatter())
        cbar.set_label(label, rotation=0)
        ax.remove()
        # save the legend
        plt.savefig(
            f"/public/legends/{instance}/{legendId}.png", bbox_inches="tight", dpi=200
        )
