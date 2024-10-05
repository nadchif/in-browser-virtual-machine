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
  boot_order: '0x123', // Boot from CD-ROM first
  memory_size: 512 * 1024 * 1024, // 512MB RAM
  vga_memory_size: 64 * 1024 * 1024, // 64MB VGA RAM
  // See more: https://github.com/copy/v86/blob/master/docs/networking.md
  net_device: {
    type: 'virtio',
    relay_url: "wisps://wisp.mercurywork.shop",
  },
  cdrom: {
    // Source: https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86/alpine-virt-3.20.3-x86.iso
    url: "/images/alpine-virt-3.20.3-x86.iso", 
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