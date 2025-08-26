# ThreePanel

## document

if your model need [draco](https://github.com/google/draco) to decode,you must specify the draco decoder path.

when using cdn path,just use like following:

```vue
<ThreePanel draco-decoder-path="https://www.gstatic.com/draco/versioned/decoders/1.4.3/"></ThreePanel>
```

if you want to use local path, you can copy draco decoder (which is in the `modules/three/examples/jsm/libs/draco`) directory to your project's `/public/draco/gltf/` directory.and use like following, `draco-decoder-path` default value is `/draco/gltf/`.

```vue
<ThreePanel draco-decoder-path="/draco/gltf/"></ThreePanel>
```
