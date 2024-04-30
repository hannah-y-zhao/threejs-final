import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh, addDash, addDot } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { translation } from './morse'
import gsap from 'gsap'

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
const blues=["blue-textured1.png","blue-textured2.png","blue.png","blue2.png"]
// init()
document.getElementById("button").onclick=checkinput
function checkinput(){
	if(document.getElementById("input").value){
		init()
	}
}

function init() {
	document.getElementById("intro").style.display="none"
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.dash=addDash()
	let material=blues[Math.floor(Math.random()*blues.length)]
	meshes.dot=addDot(material)

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	scene.add(lights.defaultLight)

	resize()
	translateToMorse()
	animate()

}

function translateToMorse(){
	let user=document.getElementById("input").value
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
	for(let i=0;i<tempArr.length;i++){
		tempArr[i].position.x+=5*i*tempArr.length
		for(let j=0;j<tempArr[i].children.length;j++){
			if(tempArr[i].children[j].userData.name=="dot"){
				tempArr[i].children[j].position.x+=(j*tempArr[i].children.length)
			// }else if(tempArr[i].children[j].userData.name=="dash"&&tempArr[i].children[j+1]){
			// 	tempArr[i].children[j+1].position.x+=6+(j*tempArr[i].children.length)
			// 
			}else{
				tempArr[i].children[j].position.x+=(j*tempArr[i].children.length)-3
			}
			tempArr[i].children[j].position.y=0
			console.log(tempArr[i].children[j].userData.name)
		}
		// tempArr[i].position.y=-i*5
	}
	setTimeout(scrunchIn,3000)
	
}

function scrunchIn(){
	gsap.to(tempArr[1].position,
		{
			y:5,
			duration:1,
			ease:'power1.inOut',
			onComplete: scrunchOut
		})
}

function scrunchOut(){
	gsap.to(tempArr[1].position,
		{
			y:0,
			duration:1,
			ease:'power1.inOut',
			onComplete: scrunchIn
		})
}


function checkSpaces(mArray,hasSpace,group){
		translateToMesh(mArray,group)
}

window.addEventListener("click",function(){
	console.log(tempArr)
	// tempArr[0].position.x+=0.5
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
		// tempArr[i].rotation.x+=0.05*i
		// tempArr[i].rotation.y+=0.01*i
		// // tempArr[i].scale.x=3
		// for(let j=0;j<tempArr[i].children.length;j++){
		// 	tempArr[i].children[j].rotation.z+=0.002*j
		// 	// tempArr[i].children[j].position.x=j
		// }
		// tempArr[i].position.y=-i*5
	}
	// tempArr[0].scale.x=2
	// tempArr[0].scale.y=2
	// tempArr[0].scale.z=2

	renderer.render(scene, camera)
}
