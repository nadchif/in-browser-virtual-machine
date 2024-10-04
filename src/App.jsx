import { useEffect } from "react";

function App(){

useEffect(function  initializeEmulator(){
  // See https://github.com/copy/v86/blob/master/src/browser/starter.js for options 
window.emulator = new window.V86({
  wasm_path:  '/v86.wasm',
  screen_container:  document.getElementById("screen_container"),
  bios: {
    url:  "/bios/seabios.bin",
  },
  vga_bios: {
    url:  "/bios/vgabios.bin",
  },
  hda: { // Hard Disk
    url:  "/images/fd12-base.img",
    async:  true,
    size:  419430400, // Recommended to add size of the image in URL. see https://github.com/copy/v86/blob/master/src/browser/starter.js 
  },
  autostart:  true,
});
}, []);

  return (
    <div id="screen_container">
      <div id="screen" style={{overflow: 'hidden'}}>Initializing Emulator...</div>
      <canvas style={{display: 'none'}}></canvas>
    </div>
    );
  }
  export default App