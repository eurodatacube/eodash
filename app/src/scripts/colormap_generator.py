#!/usr/bin/python
"""
Helper script to generate legend images from JSON configuration

Usage:
docker run --rm -it -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/colormap_generator.py
If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""
import os
import shutil
import matplotlib.pyplot as plt
from matplotlib.colors import LogNorm
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
        z = config.get("range", [0, 1])
        colormap = config.get("cm", "YlGn")
        label = config.get("label", "")
        logarithmic = config.get("logarithmic", False)
        ticks = config.get("ticks", None)

        normalization = LogNorm() if logarithmic else None

        # generate the legend
        plt.rcParams["figure.figsize"] = (3, 1)
        x = [0, 1]
        y = x
        plt.figure()
        mpb = plt.scatter(x, y, c=z, cmap=colormap, norm=normalization)

        fig, ax = plt.subplots()
        cbar = plt.colorbar(mpb, ax=ax, orientation="horizontal", ticks=ticks)
        # special handling of pre-configured ticks
        if ticks:
            cbar.ax.set_yticklabels([str(i) for i in ticks])
            # default for logarithmic ticks is 10^x notation, set scalar
            if logarithmic:
                cbar.ax.xaxis.set_major_formatter(ScalarFormatter())
        cbar.set_label(label, rotation=0)
        ax.remove()
        # save the legend
        plt.savefig(
            f"/public/legends/{instance}/{legendId}.png", bbox_inches="tight", dpi=200
        )
