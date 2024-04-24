import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

export function addBoilerPlateMesh() {
	const box = new THREE.BoxGeometry(0.5, 0.5, 0.5)
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(2, 0, 0)
	return boxMesh
}

export function addStandardMesh() {
	const box = new THREE.BoxGeometry(1, 1, 1)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}

export function addDash(){
	const box=new THREE.BoxGeometry(3,1,1)
	const boxMaterial=new THREE.MeshStandardMaterial({color: "aqua"})
	const boxMesh=new THREE.Mesh(box,boxMaterial)
	boxMesh.position.set(0,0,0)
	return boxMesh
}

export function addDot(){
	const sphere=new THREE.SphereGeometry(.5,10,10)
	const sphereMaterial=new THREE.MeshStandardMaterial({color:"aqua"})
	const sphereMesh=new THREE.Mesh(sphere,sphereMaterial)
	sphereMesh.position.set(0,0,3)
	return sphereMesh
}