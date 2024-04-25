import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh, addDash, addDot } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { translation } from './morse'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
let tempArr=[]
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.dash=addDash()
	meshes.dot=addDot()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	scene.add(lights.defaultLight)

	resize()
	animate()
	translateToMorse()
}

function translateToMorse(){
	let user=prompt("type")
	if(user.length>0){
		let userText
		if(user.indexOf(" ")!==-1){//has white space
			userText=user.split(" ")
			let userText2=[]
			let userMorse=[]
			for(let i=0;i<userText.length;i++){
				userText2.push(userText[i].split(""))
				tempArr[i]=new THREE.Group()
				for(let j=0;j<userText2[i].length;j++){
					userMorse.push([translation(userText2[i][j])])
					checkSpaces(userMorse[userMorse.length-1],true,tempArr[i])
				}
				
			}
		}else{
			userText=user.split("")
			tempArr[0]=new THREE.Group()
			let userMorse=[]
			for(let i=0;i<userText.length;i++){
				userMorse.push(translation(userText[i]))
			}
			checkSpaces(userMorse,false,tempArr[0])
		}
	}
}


function checkSpaces(mArray,hasSpace,group){
		translateToMesh(mArray,group)
}

window.addEventListener("click",function(){
	console.log(tempArr[0].children)
	tempArr[0].position.x+=0.5
})

function translateToMesh(mArray,group){
	let count=0
	
	for(let i=0;i<mArray.length;i++){
		let charMorse=mArray[i].split("")
		for(let j=0;j<charMorse.length;j++){
			if(charMorse[j]=="."){
				meshes["letter"+i+"-dot"+j]=addDot()
				group.add(meshes["letter"+i+"-dot"+j])
				scene.add(group)
				meshes["letter"+i+"-dot"+j].position.x=-3+j*i
				meshes["letter"+i+"-dot"+j].position.y=count
			}
			else if(charMorse[j]=="-"){
				meshes["letter"+i+"-dash"+j]=addDash()
				group.add(meshes["letter"+i+"-dash"+j])
				scene.add(group)
				meshes["letter"+i+"-dash"+j].position.y=-3+j*i
				meshes["letter"+i+"-dash"+j].position.x=count*4
			}
		}
		count++
	}
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	meshes.dot.rotation.x += 0.01
	meshes.dot.rotation.z += 0.01

	for(let i=0;i<tempArr.length;i++){
		tempArr[i].rotation.x+=0.05*i
		tempArr[i].rotation.y+=0.01*i
		for(let j=0;j<tempArr[i].children.length;j++){
			tempArr[i].children[j].rotation.z+=0.002*j
			tempArr[i].children[j].position.x=j
		}
	}
	renderer.render(scene, camera)
}
