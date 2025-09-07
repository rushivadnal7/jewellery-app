import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GLView } from "expo-gl";
import { Asset } from "expo-asset";
import { Renderer, loadAsync } from "expo-three";
import * as THREE from "three";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/colors";
import { useFocusEffect } from '@react-navigation/native';

const Hero = React.memo(() => {
    const modelRef = useRef(null);
    const requestRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const isLoadingRef = useRef(false);
    const isInitializedRef = useRef(false);
    const glContextRef = useRef(null);

    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [key, setKey] = useState(0); 

    useFocusEffect(
        useCallback(() => {
            if (isInitializedRef.current) {
                console.log('🔄 Tab refocused, resetting 3D model...');
                
                isInitializedRef.current = false;
                isLoadingRef.current = false;
                setIsModelLoaded(false);
                setLoadingProgress(0);
                
                setKey(prev => prev + 1);
            }
            
            return () => {
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                    requestRef.current = null;
                }
            };
        }, [])
    );

    const onContextCreate = useCallback(async (gl: { drawingBufferWidth: any; drawingBufferHeight: any; } | null) => {
        if (isInitializedRef.current || isLoadingRef.current) {
            return;
        }

        console.log('🎮 Creating GL context...');
        glContextRef.current = gl;
        isInitializedRef.current = true;
        isLoadingRef.current = true;

        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        try {
            const renderer = new Renderer({ gl });
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 0); 
            rendererRef.current = renderer;

            
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);
            cameraRef.current = camera;

            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
            mainLight.position.set(5, 5, 5);
            scene.add(mainLight);

            const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
            fillLight.position.set(-3, 2, 3);
            scene.add(fillLight);

            // Load model
            try {
                setLoadingProgress(30);

                const asset = Asset.fromModule(
                    require("../../assets/models/cuban_palm_chain_on_jewellery_neck_stand.glb")
                );

                await asset.downloadAsync();
                setLoadingProgress(70);

                const originalError = console.error;
                console.error = (...args) => {
                    if (args[0]?.includes?.("THREE.GLTFLoader: Couldn't load texture")) return;
                    originalError(...args);
                };

                const object = await loadAsync(asset.localUri);
                console.error = originalError;

                setLoadingProgress(90);

                const model = object?.scene || object;
                if (model) {
                    modelRef.current = model;

                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    const maxDimension = Math.max(size.x, size.y, size.z);
                    const scale = 2.0 / maxDimension; 
                    model.scale.setScalar(scale);

                    model.position.copy(center).multiplyScalar(-scale);

                    scene.add(model);
                    console.log("✅ Model centered and loaded");
                }

                setLoadingProgress(100);
                setTimeout(() => {
                    setIsModelLoaded(true);
                    isLoadingRef.current = false;
                }, 500);

            } catch (error) {
                console.error("Model load error:", error);
                setIsModelLoaded(true);
                isLoadingRef.current = false;
            }

            let time = 0;
            const render = () => {
                if (!isInitializedRef.current || !glContextRef.current) return;

                requestRef.current = requestAnimationFrame(render);
                time += 0.008; 

                if (modelRef.current) {
                    modelRef.current.rotation.y = time;
                    modelRef.current.position.y += Math.sin(time * 2) * 0.001;
                }

                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                    glContextRef.current.endFrameEXP();
                }
            };

            render();

        } catch (error) {
            console.error("Context setup error:", error);
            setIsModelLoaded(true);
            isLoadingRef.current = false;
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            console.log('🧹 Cleaning up Hero component...');
            
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }

            if (sceneRef.current) {
                sceneRef.current.traverse((object: { geometry: { dispose: () => void; }; material: { forEach: (arg0: (material: any) => any) => void; dispose: () => void; }; }) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material: { dispose: () => any; }) => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            isInitializedRef.current = false;
            isLoadingRef.current = false;
            modelRef.current = null;
            sceneRef.current = null;
            rendererRef.current = null;
            cameraRef.current = null;
            glContextRef.current = null;
        };
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000000', '#001a0d', '#000000']}
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            
            {/* <View style={[styles.greenPatch, styles.centerPatch]} />
            <View style={[styles.greenPatch, styles.topLeftPatch]} />
            <View style={[styles.greenPatch, styles.bottomRightPatch]} />
            <View style={[styles.greenPatch, styles.topRightPatch]} />
            <View style={[styles.greenPatch, styles.bottomLeftPatch]} /> */}

            {!isModelLoaded && (
                <View style={styles.loadingOverlay}>
                    <Text style={styles.logoText}>BINNY'S</Text>
                    <View style={styles.loadingBar}>
                        <View style={[styles.loadingProgress, { width: `${loadingProgress}%` }]} />
                    </View>
                    <Text style={styles.loadingText}>
                        {loadingProgress < 40 ? 'Loading...' :
                            loadingProgress < 80 ? 'Preparing model...' : 'Almost ready...'}
                    </Text>
                </View>
            )}

            <View style={styles.topText}>
                <Text style={styles.brandTitle}>BINNY'S</Text>
                <Text style={styles.subtitle}>Premium Jewelry Collection</Text>
            </View>

            <View style={styles.modelContainer}>
                <GLView
                    key={key} 
                    style={styles.glView}
                    onContextCreate={onContextCreate}
                />
            </View>

            <View style={styles.bottomText}>
                <Text style={styles.description}>Cuban Palm Chain</Text>
                <Text style={styles.tagline}>Crafted to Perfection</Text>
            </View>
        </View>
    );
});

Hero.displayName = 'Hero';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative',
    },

    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },

    greenPatch: {
        position: 'absolute',
        backgroundColor: colors.primary,
        opacity: 0.08,
        borderRadius: 100,
    },
    centerPatch: {
        width: 120,
        height: 120,
        top: '45%',
        left: '50%',
        marginLeft: -60,
        marginTop: -60,
        zIndex: 1,
    },
    topLeftPatch: {
        width: 80,
        height: 80,
        top: '15%',
        left: '10%',
        zIndex: 1,
    },
    topRightPatch: {
        width: 60,
        height: 60,
        top: '20%',
        right: '15%',
        zIndex: 1,
    },
    bottomLeftPatch: {
        width: 70,
        height: 70,
        bottom: '25%',
        left: '8%',
        zIndex: 1,
    },
    bottomRightPatch: {
        width: 90,
        height: 90,
        bottom: '20%',
        right: '12%',
        zIndex: 1,
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    logoText: {
        fontSize: 36,
        fontFamily: 'TitleFont',
        color: colors.primary,
        marginBottom: 30,
    },
    loadingBar: {
        width: 200,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 1,
        overflow: 'hidden',
        marginBottom: 20,
    },
    loadingProgress: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 1,
    },
    loadingText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 1,
    },

    topText: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5,
    },
    brandTitle: {
        fontSize: 28,
        fontFamily: 'TitleFont',
        color: colors.primary,
        letterSpacing: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 2,
        marginTop: 5,
        fontWeight: '300',
    },

    modelContainer: {
        flex: 1,
        marginTop: 80, 
        marginBottom: 80, 
        position: 'relative',
        height: 300,
        zIndex: 3,
    },
    glView: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    // Bottom text section
    bottomText: {
        position: 'absolute',
        bottom: 160,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5,
    },
    description: {
        fontSize: 16,
        color: colors.primary,
        letterSpacing: 1,
        fontWeight: '500',
        marginBottom: 5,
    },
    tagline: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: 1,
        fontStyle: 'italic',
    },
});

export default Hero;