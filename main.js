import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './targets/targetsFirstAid.mind', // ✅ ใช้ชื่อของคุณ
      maxTrack: 5,
    });

    const { renderer, scene, camera } = mindarThree;

    // ฟังก์ชันสร้าง video plane
    const createVideoPlane = (src, width = 1, height = 0.6) => {
      const video = document.createElement('video');
      video.src = src;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      const texture = new THREE.VideoTexture(video);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const geometry = new THREE.PlaneGeometry(width, height);
      const plane = new THREE.Mesh(geometry, material);

      return { video, plane };
    };

    // 🎬 วิดีโอ 5 ตัว (ลิงก์ของคุณ)
    const v1 = createVideoPlane('https://drive.google.com/uc?export=download&id=1_6M0cGr4W2Uaxnc5s60gs-juWWpRZSKW');
    const v2 = createVideoPlane('https://drive.google.com/uc?export=download&id=1FYajn2WySKK0qFJy-okSb-rXSMlzfCsY');
    const v3 = createVideoPlane('https://drive.google.com/uc?export=download&id=18u9uqh2HFA312dBAe_rH3gRe6vDP_V4J');
    const v4 = createVideoPlane('https://drive.google.com/uc?export=download&id=1TVrG30cEwKmJF6VkfoIGCjMcAT-LnpC8');
    const v5 = createVideoPlane('https://drive.google.com/uc?export=download&id=1d7Z31f2bOq8IrbUU4s3s2Dd8wGc6Xg5Q');

    // 🎯 ผูก marker
    const anchors = [
      { data: v1, anchor: mindarThree.addAnchor(0) },
      { data: v2, anchor: mindarThree.addAnchor(1) },
      { data: v3, anchor: mindarThree.addAnchor(2) },
      { data: v4, anchor: mindarThree.addAnchor(3) },
      { data: v5, anchor: mindarThree.addAnchor(4) },
    ];

    anchors.forEach(({ data, anchor }) => {
      anchor.group.add(data.plane);

      anchor.onTargetFound = () => {
        data.video.play();
      };

      anchor.onTargetLost = () => {
        data.video.pause();
      };
    });

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // 👇 เผื่อบางเครื่องต้องแตะจอ
    document.body.addEventListener('click', () => {
      document.querySelectorAll('video').forEach(v => v.play());
    });

  };

  start();
});
