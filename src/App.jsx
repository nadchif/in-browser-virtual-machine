import { useEffect, useRef, useState } from "react";
import useWindowScaling from "./hooks/useWindowScaling";
import { RECOMMENDED_IMAGES } from "./config";

function App() {
  const [isoFile, setIsoFile] = useState(null);
  const { vgaHeight, vgaWidth, textSize, updateSize } = useWindowScaling();
  const cdRomObjectUrlRef = useRef(null);
  const screenContainerRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(
    function initializeEmulator() {
      if (!isoFile) {
        window.dialog.showModal();
        return;
      }
      if (cdRomObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(cdRomObjectUrlRef.current);
        } catch (e) {
          console.error(e);
        }
      }
      cdRomObjectUrlRef.current = URL.createObjectURL(isoFile);
      // See https://github.com/copy/v86/blob/master/src/browser/starter.js for options
      window.emulator = new window.V86({
        wasm_path: "./v86.wasm",
        screen_container: screenContainerRef.current,
        bios: {
          url: "./bios/seabios.bin",
        },
        vga_bios: {
          url: "./bios/vgabios.bin",
        },
        boot_order: "0x123", // Boot from CD-ROM first
        memory_size: 512 * 1024 * 1024, // 512MB RAM
        vga_memory_size: 64 * 1024 * 1024, // 64MB VGA RAM
        // See more: https://github.com/copy/v86/blob/master/docs/networking.md
        net_device: {
          type: "virtio",
          relay_url: "wisps://wisp.mercurywork.shop",
        },
        cdrom: {
          url: cdRomObjectUrlRef.current,
        },
        autostart: true,
        scale: 1,
      });

      window.dialog.close();
      const alertUser = (e) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", alertUser);
      const updateSizeTimeout = setTimeout(updateSize, 1000);
      return () => {
        clearTimeout(updateSizeTimeout);
        window.removeEventListener("beforeunload", alertUser);
      };
    },
    [isoFile]
  );

  const powerOff = () => {
    if (window.emulator) {
      try {
        window.emulator.restart();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const ejectCD = () => {
    const confirmed = window.confirm("Are you sure you want to eject the CD?");
    if (!confirmed) {
      return;
    }
    powerOff();
    setIsoFile(null);
  };

  return (
    <>
      <div>
        {isoFile && (
          <>
            <div id="screen_container" ref={screenContainerRef} style={{ height: vgaHeight }}>
              <div
                id="screen"
                ref={screenRef}
                style={{
                  fontSize: `${textSize}px`,
                  lineHeight: `${textSize}px`,
                  height: vgaHeight,
                }}
              >
                Initializing Emulator...
              </div>
              <canvas
                style={{
                  width: vgaWidth,
                  height: vgaHeight,
                }}
              />
            </div>
            <div className="controls">
              <div>
                <label>
                  <span>{isoFile.name}</span>
                </label>
                &bull;
                <button>&#8709; Power Off</button>&bull;
                <button type="button" onClick={ejectCD}>
                  &#9167; Eject CD...
                </button>
                &bull;&nbsp;
                <a
                  href="https://github.com/nadchif/in-browser-virtual-machine"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>
              </div>
            </div>
          </>
        )}
      </div>
      <dialog id="dialog">
        <h1> Run a Virtual Machine in your browser! </h1>
        <label>
          Select a bootable ISO file:
          <div>
            <input type="file" accept=".iso" onChange={(e) => setIsoFile(e.target.files[0])} />
          </div>
        </label>
        <p>Here are some recommended ones you can download first:</p>
        <ul>
          {RECOMMENDED_IMAGES.map(({ url, name }) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer" download>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
export default App;
