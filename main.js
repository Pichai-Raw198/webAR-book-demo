import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './targets/targets.mind',
      maxTrack: 5, // มี 5 marker
    });

    const { renderer, scene, camera } = mindarThree;

    // ฟังก์ชันสร้าง video plane
    const createVideoPlane = (src, width = 1, height = 0.6) => {
      const video = document.createElement('video');
      video.src = src;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      const texture = new THREE.VideoTexture(video);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const geometry = new THREE.PlaneGeometry(width, height);
      const plane = new THREE.Mesh(geometry, material);

      return { video, plane };
    };

    // =========================
    // 🎬 สร้างวิดีโอทั้ง 5 ตัว
    // =========================
    const v1 = createVideoPlane('./videos/1-FirstAid.mp4');
    const v2 = createVideoPlane('./videos/2-FirstAid.mp4');
    const v3 = createVideoPlane('./videos/3-FirstAid.mp4');
    const v4 = createVideoPlane('./videos/4-FirstAid.mp4');
    const v5 = createVideoPlane('./videos/5-FirstAid.mp4');

    // =========================
    // 🎯 ผูกกับ marker
    // =========================
    const anchors = [
      { data: v1, anchor: mindarThree.addAnchor(0) },
      { data: v2, anchor: mindarThree.addAnchor(1) },
      { data: v3, anchor: mindarThree.addAnchor(2) },
      { data: v4, anchor: mindarThree.addAnchor(3) },
      { data: v5, anchor: mindarThree.addAnchor(4) },
    ];

    anchors.forEach(({ data, anchor }) => {
      // เพิ่ม plane เข้าไป
      anchor.group.add(data.plane);

      // เล่นวิดีโอเมื่อเจอ marker
      anchor.onTargetFound = () => {
        data.video.play();
      };

      // หยุดเมื่อไม่เจอ
      anchor.onTargetLost = () => {
        data.video.pause();
      };
    });

    // เริ่ม AR
    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  start();
});