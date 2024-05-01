import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh, addDash, addDot } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { translation } from './morse'
import gsap from 'gsap'
import { randomAll, randomGroup} from './random-matcap'

const scene = new THREE.Scene()

function setBg(){
	const r=Math.floor(Math.random()*256)
	const g=Math.floor(Math.random()*256)
	const b=Math.floor(Math.random()*256)
	// console.log(randomColor)
	scene.background = new THREE.Color( `rgb(${r},${g},${b})`)
	// document.body.style.backgroundColor = "#" + randomColor;
	// color.innerHTML = "#" + randomColor;
}
  
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
)
camera.position.set(0, 0, 50)
let introShapes=[]

function intro(){
	// document.getElementById("intro").style.display="none"
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	lights.defaultLight = addLight()
	resize()


	scene.add(lights.defaultLight)
	setBg()
	
	
	let index=0
	const randShapes=Math.floor(Math.random()*5)+5
	for (let i=0;i<randShapes;i++){
		const temp=Math.floor(Math.random()*randShapes)+1
		let scaleF=i%2+1
		if (temp%2==0){
			introShapes.push(addDot(randomAll()))
			introShapes[index].scale.set(scaleF,scaleF,scaleF)
			introShapes[index].position.x=Math.floor(Math.random()*renderer.width)
			introShapes[index].position.y=Math.floor(Math.random()*window.innerHeight)
			introShapes[index].position.z=-Math.floor(Math.random()*10)
			scene.add(introShapes[index])
		}else{
			introShapes.push(addDash(randomAll()))
			introShapes[index].scale.set(scaleF,scaleF,scaleF)
			scene.add(introShapes[index])
		}
		index++
	}
	console.log(scene.children)
	animate()
}

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
let tempArr=[]
// const blues=["blue-textured1","blue-textured2","blue","blue2","aqua","lightblue","metallic-red-blue","orange-blue","soft-blue","soft-metallic-orange-blue","soft-metallic-yellow-blue"]
// init()
document.getElementById("button").onclick=checkinput
function checkinput(){
	if(document.getElementById("input").value){
		for(let i=0;i<introShapes.length;i++){
			scene.remove(introShapes[i])
		}
		init()
		// intro()
	}
}
// intro()

function init() {
	// introShapes=[]
	document.getElementById("intro").style.display="none"
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	// meshes.default = addBoilerPlateMesh()
	// meshes.standard = addStandardMesh()
	// meshes.dash=addDash()
	// let material=blues[Math.floor(Math.random()*blues.length)]
	// meshes.dot=addDot(material)

	//lights
	lights.defaultLight = addLight()

	//changes
	// meshes.default.scale.set(2, 2, 2)

	scene.add(lights.defaultLight)

	resize()
	translateToMorse()
	animate()
	setBg()
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
	meshes.pivot=new THREE.Object3D()

	let currPosition = 0
	for(let i=0;i<tempArr.length;i++){
		console.log(getSize(tempArr[i])*1.5)
		currPosition += getSize(tempArr[i]) * 1.5
		tempArr[i].position.x = currPosition
		// console.log(getSize(tempArr[i]))

		let size = tempArr[i].children.reduce((currentPosition, currentElement)=>{
			if(currentElement.userData.name === 'dot'){
				currentPosition += 2
			}else{
				currentPosition += 3
			}
			currentElement.position.x = currentPosition
			return currentPosition
		}, 2)
		// console.log(size)
		// console.log(tempArr[tempArr.length-1])
		// console.log(tempArr)

		// tempArr[i].position.x+=5*i*tempArr.length
		// for(let j=0;j<tempArr[i].children.length;j++){
		// 	if(tempArr[i].children[j].userData.name=="dot"){
		// 		tempArr[i].children[j].position.x+=(j*tempArr[i].children.length)
		// 	// }else if(tempArr[i].children[j].userData.name=="dash"&&tempArr[i].children[j+1]){
		// 	// 	tempArr[i].children[j+1].position.x+=6+(j*tempArr[i].children.length)
		// 	// 
		// 	}else{
		// 		tempArr[i].children[j].position.x+=(j*tempArr[i].children.length)-3
		// 	}
		// 	tempArr[i].children[j].position.y=0
		// 	console.log(tempArr[i].children[j].userData.name)

		// }
		// tempArr[i].position.y=-i*5
		// meshes.pivot.add(tempAr[i])
	}

	setTimeout(scrunchIn,3000)
	
}

function scrunchIn(){
	gsap.to(tempArr[1].position,
		{
			y:5,
			duration:3,
			ease:'power1.inOut',
			onComplete: scrunchOut
		})
	gsap.to(tempArr[0].position,
		{
			x:tempArr[0].position.x-=2,
			duration:3,
			ease:'power1.inOut',
			onComplete: scrunchOut
		})
}

function scrunchOut(){
	gsap.to(tempArr[1].position,
		{
			x:tempArr[1].position.x-=2,
			y:0,
			duration:3,
			ease:'power1.inOut',
			onComplete: scrunchIn
		})
	gsap.to(tempArr[2].position,
		{
			x:tempArr[2].position.x-=2,
			duration:3,
			ease:'power1.inOut',
			onComplete: scrunchIn
		})
}


function checkSpaces(mArray,hasSpace,group){
		translateToMesh(mArray,group)
}

window.addEventListener("click",function(){
	// console.log(tempArr)
	// tempArr[0].position.x+=0.5
})

function translateToMesh(mArray,group){
	// console.log(mArray)
	let count=0
	
	for(let i=0;i<mArray.length;i++){
		let charMorse=mArray[i].split("")
		for(let j=0;j<charMorse.length;j++){
			if(charMorse[j]=="."){
				let temp=randomAll()
				meshes["letter"+i+"-dot"+j]=addDot(temp)
				group.add(meshes["letter"+i+"-dot"+j])
				scene.add(group)
				meshes["letter"+i+"-dot"+j].position.x=-3+j*i
				meshes["letter"+i+"-dot"+j].position.y=count
			}
			else if(charMorse[j]=="-"){
				let temp=randomAll()
				meshes["letter"+i+"-dash"+j]=addDash(temp)
				group.add(meshes["letter"+i+"-dash"+j])
				scene.add(group)
				meshes["letter"+i+"-dash"+j].position.y=-3+j*i
				meshes["letter"+i+"-dash"+j].position.x=count*4
			}
		}

		count++
	}
	// console.log(getSize(group))

}

function getSize(_group){
	// console.log('called')
	let size = 0
	_group.children.forEach((child)=>{
		if(child.userData.name === 'dot'){
			size += 2
		}else{
			size +=3
		}
		
	})
	console.log('size', size)
	return size
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
	// console.log(scene.children)

	// meshes.dot.rotation.x += 0.01
	// meshes.dot.rotation.z += 0.01
	if(introShapes[0]){
		for(let i=0;i<introShapes.length;i++){
			introShapes[i].rotation.x+=0.01*i+0.01
			introShapes[i].rotation.y+=0.01*i+0.01
			// // tempArr[i].scale.x=3
			// for(let j=0;j<tempArr[i].children.length;j++){
			// 	tempArr[i].children[j].rotation.z+=0.002*j
			// 	// tempArr[i].children[j].position.x=j
			// }
			// tempArr[i].position.y=-i*5
		}
	}

	
	// tempArr[0].scale.x=2
	// tempArr[0].scale.y=2
	// tempArr[0].scale.z=2

	if (meshes.pivot){
		meshes.pivot.rotation.y +=0.01
	}
	renderer.render(scene, camera)
}
