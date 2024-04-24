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
let group1 = new THREE.Group()
let grouptest=new THREE.Group()
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

	// meshes.g1 = addBoilerPlateMesh()
	// meshes.g2 = addBoilerPlateMesh()
	// meshes.g2.position.set(0, 5, 0)
	// group1.add(meshes.g1)
	// group1.add(meshes.g2)
	// scene.add(group1)
	// meshes[g1]

	//scene operations
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	// scene.add(meshes.dash)
	// scene.add(meshes.dot)
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
			// console.log("user"+user)
			userText=user.split(" ")
			// console.log(userText)
			let userText2=[]
			let userMorse=[]
			for(let i=0;i<userText.length;i++){
				userText2.push(userText[i].split(""))
				tempArr[i]=new THREE.Group()
			}
			// console.log(userText2)
			for(let i=0;i<userText.length;i++){
				for(let j=0;j<userText[i].length;j++){
					userMorse.push([translation(userText2[i][j])])
				}
			}

			 console.log(userMorse)
			checkSpaces(userMorse,true)
		}else{
			userText=user.split("")
			tempArr[0]=new THREE.Group()
			let userMorse=[]
			for(let i=0;i<userText.length;i++){
				userMorse.push(translation(userText[i]))
			}
			checkSpaces(userMorse,false)
		}
	}
}


function checkSpaces(mArray,hasSpace){
	let dashArray=[]
	let dotArray=[]
	let count=0
	// console.log("marray"+mArray)
	if(hasSpace){
		for(let i=0;i<mArray.length;i++){
			translateToMesh(mArray[i],tempArr[i])
		}
		// console.log("98: "+ mArray)
	}else{
		translateToMesh(mArray,tempArr[0])
		console.log("tempi",tempArr[0])

	}
	// for(let i=0;i<mArray.length;i++){
	// 	let charMorse=mArray[i].split(" ")
	// 	// console.log(charMorse)
	// 	for(let j=0;j<charMorse.length;j++){
	// 		// console.log(charMorse)
	// 		if(charMorse[j]=="."){
	// 			meshes["letter"+i+"-dot"+j]=addDot()
	// 			group1.add(meshes["letter"+i+"-dot"+j])
	// 			// let temp=addDot()
	// 			scene.add(meshes["letter"+i+"-dot"+j])
	// 			// dotArray.push(temp)
	// 			meshes["letter"+i+"-dot"+j].position.x=-3+j
	// 			meshes["letter"+i+"-dot"+j].position.y=count
	// 		}
	// 		else if(charMorse[j]=="-"){
	// 			let temp=addDash()
	// 			scene.add(temp)
	// 			dashArray.push(temp)
	// 			temp.position.y=-3+j*2
	// 			temp.position.x=count*4
	// 		}
	// 	}
	// 	count++
	// }
	console.log("tempar")
	console.log(tempArr)
}
window.addEventListener("click",function(){
	console.log(tempArr[0])
})
function translateToMesh(mArray,group){
	let dashArray=[]
	let dotArray=[]
	let count=0
	// console.log("127: "+ mArray)
	// console.log(group)
	for(let i=0;i<mArray.length;i++){
		let charMorse=mArray[i].split("")
		// console.log(charMorse)
		for(let j=0;j<charMorse.length;j++){
			// console.log(charMorse)
			if(charMorse[j]=="."){
				
				meshes["letter"+i+"-dot"+j]=addDot()
				group1.add(meshes["letter"+i+"-dot"+j])
				group.add(meshes["letter"+i+"-dot"+j])
				console.log(meshes["letter"+i+"-dot"+j])
				console.log(group)
				// let temp=addDot()
				scene.add(meshes["letter"+i+"-dot"+j])
				// scene.add(temp)
				// dotArray.push(temp)
				meshes["letter"+i+"-dot"+j].position.x=-3+j*i
				meshes["letter"+i+"-dot"+j].position.y=count
				console.log("working"+ i+ j)
			}
			else if(charMorse[j]=="-"){
				// let temp=addDash()
				// scene.add(temp)
				// dashArray.push(temp)
				// temp.position.y=-3+j*2
				// temp.position.x=count*4

				meshes["letter"+i+"-dash"+j]=addDash()
				group1.add(meshes["letter"+i+"-dash"+j])
				group.add(meshes["letter"+i+"-dash"+j])
				meshes["letter"+i+"-dash"+j].y=-3+j*2*i
				meshes["letter"+i+"-dash"+j].x=count*4
				// let temp=addDot()
				scene.add(meshes["letter"+i+"-dash"+j])
				// scene.add(temp)
				// dotArray.push(temp)
				
			}
			console.log("working"+ i+ j)

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

	// meshes.dash.rotation.x += 0.01
	// meshes.dash.rotation.z += 0.01

	meshes.dot.rotation.x += 0.01
	meshes.dot.rotation.z += 0.01
	// meshes.dot.position.x+=0.01
	// group1.rotation.x += 0.1
	// meshes.default.scale.x += 0.01
	//console.log(scene.children)
	// console.log(tempArr)
	renderer.render(scene, camera)
}
