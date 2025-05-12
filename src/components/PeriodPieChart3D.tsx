
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePeriodTracking } from "@/lib/period-context";
import { Card, CardContent } from "@/components/ui/card";

export function PeriodPieChart3D() {
  const { cycles, getAverageCycleLength, getAveragePeriodLength } = usePeriodTracking();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    pie: THREE.Group;
    animationFrame: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene only once
    if (!sceneRef.current) {
      const width = containerRef.current.clientWidth;
      const height = 300; // Fixed height for the chart
      
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5);
      
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      
      // Clear any existing canvas
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      
      containerRef.current.appendChild(renderer.domElement);
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x999999);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 2);
      scene.add(directionalLight);
      
      // Create pie chart group
      const pieGroup = new THREE.Group();
      scene.add(pieGroup);
      
      sceneRef.current = {
        scene,
        camera,
        renderer,
        pie: pieGroup,
        animationFrame: 0
      };
      
      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !sceneRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = 300;
        
        sceneRef.current.camera.aspect = width / height;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Animation
      const animate = () => {
        if (!sceneRef.current) return;
        
        sceneRef.current.pie.rotation.y += 0.005;
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
        sceneRef.current.animationFrame = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (sceneRef.current) {
          cancelAnimationFrame(sceneRef.current.animationFrame);
          sceneRef.current.renderer.dispose();
          sceneRef.current = null;
        }
      };
    }
  }, []);
  
  // Update pie chart segments when cycles data changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear previous pie segments
    while (sceneRef.current.pie.children.length > 0) {
      const object = sceneRef.current.pie.children[0];
      sceneRef.current.pie.remove(object);
    }
    
    const avgCycleLength = getAverageCycleLength();
    const avgPeriodLength = getAveragePeriodLength();
    const fertileLength = 6; // Average fertile window (5 days + ovulation)
    const remainingDays = avgCycleLength - avgPeriodLength - fertileLength;
    
    // Define data for pie chart
    const data = [
      { value: avgPeriodLength, color: new THREE.Color(0xE91E63) }, // Period - Pink
      { value: fertileLength, color: new THREE.Color(0x3F51B5) },   // Fertile - Blue
      { value: remainingDays, color: new THREE.Color(0x4CAF50) }    // Other days - Green
    ];
    
    // Create pie chart segments
    const radius = 1.5;
    const depth = 0.4;
    let startAngle = 0;
    
    data.forEach(item => {
      const angle = (item.value / avgCycleLength) * Math.PI * 2;
      
      // Create pie segment
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
      
      const arcCurve = new THREE.EllipseCurve(
        0, 0,
        radius, radius,
        startAngle, startAngle + angle,
        false, 0
      );
      
      const arcPoints = arcCurve.getPoints(32);
      arcPoints.forEach(point => {
        shape.lineTo(point.x, point.y);
      });
      
      shape.lineTo(0, 0);
      
      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.05
      };
      
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshPhongMaterial({ 
        color: item.color,
        shininess: 50,
        transparent: true,
        opacity: 0.9
      });
      
      const segment = new THREE.Mesh(geometry, material);
      segment.position.z = -depth/2;
      
      sceneRef.current.pie.add(segment);
      
      startAngle += angle;
    });
    
    // Tilt the pie chart slightly
    sceneRef.current.pie.rotation.x = Math.PI / 8;
    
  }, [cycles, getAverageCycleLength, getAveragePeriodLength]);
  
  return (
    <Card className="overflow-hidden border-primary/20 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex justify-center flex-col items-center">
          <h3 className="text-lg font-medium text-center">Period Distribution</h3>
          <p className="text-sm text-muted-foreground text-center">
            How your cycle is typically distributed
          </p>
        </div>
        
        <div className="h-[300px] w-full" ref={containerRef}></div>
        
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-xs">{getAveragePeriodLength()} days: Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">6 days: Fertile Window</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">
              {getAverageCycleLength() - getAveragePeriodLength() - 6} days: Other
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
