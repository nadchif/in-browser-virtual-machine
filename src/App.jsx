import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';

const term = new Terminal();
function App() {
  const terminalDivRef = useRef(null);

  useEffect(function initializeEmulator() {
    if (!window.emulator) {
      term.write('Loading emulator. Please wait it may take a few minutes to boot...\n');
      // See https://github.com/copy/v86/blob/master/src/browser/starter.js for options
      window.emulator = new window.V86({
        wasm_path: '/v86.wasm',
        screen_container: document.getElementById('screen_container'),
        bios: {
          url: '/bios/seabios.bin',
        },
        vga_bios: {
          url: '/bios/vgabios.bin',
        },
        boot_order: '0x123', // Boot from CD-ROM first
        memory_size: 512 * 1024 * 1024, // 512MB RAM
        vga_memory_size: 64 * 1024 * 1024, // 64MB VGA RAM
        // See more: https://github.com/copy/v86/blob/master/docs/networking.md
        net_device: {
          type: 'virtio',
          relay_url: 'wisps://wisp.mercurywork.shop',
        },
        cdrom: {
          // Source: https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86/alpine-virt-3.20.3-x86.iso
          url: '/images/alpine-virt-3.20.3-x86.iso',
        },
        autostart: true,
      });
      term.open(terminalDivRef.current);
      term.onKey((e) => window.emulator.serial0_send(e.key));
      window.emulator.add_listener('serial0-output-byte', (byte) =>
        term.write(String.fromCharCode(byte))
      );
    }
  }, []);

  return <div ref={terminalDivRef} id="terminal"></div>;
}
export default App;
