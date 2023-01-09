import store from '@/store';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProj } from 'ol/proj';

function createProjection(name, def, extent) {
  proj4.defs(name, def);
  register(proj4);
  const projection = getProj(name);
  projection.setExtent(extent);
  return projection;
}

export default function getProjectionOl(projectionLike) {
  if (typeof projectionLike === 'string') {
    // expecting EPSG:4326 or EPSG:3857 or something OL supports out of box
    return getProj(projectionLike);
  }
  if (projectionLike) {
    // expecting an object with name, def, extent for proj4 to register custom projection
    return createProjection(projectionLike.name, projectionLike.def, projectionLike.extent);
  }
  const defaultProjection = store.state.config.baseConfig.defaultLayersDisplay.mapProjection;
  return getProj(defaultProjection);
}
