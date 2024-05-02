import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMesh,
	addStandardMesh,
	addDash,
	addDot,
} from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { translation } from './morse'
import gsap from 'gsap'
import { randomAll, randomGroup } from './random-matcap'

const scene = new THREE.Scene()

function setBg() {
	const r = Math.floor(Math.random() * 256)
	const g = Math.floor(Math.random() * 256)
	const b = Math.floor(Math.random() * 256)

	scene.background = new THREE.Color(`rgb(${r},${g},${b})`)
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
)
camera.position.set(0, 0, 50)
let introShapes = []

function intro() {
	let introDiv=document.querySelector("#intro")
	introDiv.style.background=
	`linear-gradient(${Math.floor(Math.random()*360)}deg,rgb(${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} / 100%),rgb(${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} / 0%) ${Math.floor(Math.random()*50)+30}%), 
	linear-gradient(${Math.floor(Math.random()*360)}deg,rgb(${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} / 100%),rgb(${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} / 0%) ${Math.floor(Math.random()*50)+30}%),
	linear-gradient(${Math.floor(Math.random()*360)}deg,rgb(${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} / 100%),rgb(${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} ${Math.floor(Math.random()*256)} / 0%) ${Math.floor(Math.random()*50)+20}%)`
  	console.log(introDiv.style)
}
intro()

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
let tempArr = []
const points=[
	new THREE.Vector3(40,0,0),
	new THREE.Vector3(34.64,0, 20),
	new THREE.Vector3(20,0,34.64),
	new THREE.Vector3(0,0,40),
	new THREE.Vector3(-20,0,34.64),
	new THREE.Vector3(-34.64,0,20),
	new THREE.Vector3(-40,0, 0),
	new THREE.Vector3(-34.64,0,-20),
	new THREE.Vector3(-20,0,-34.64),
	new THREE.Vector3(0,0,-40),
]
const path=new THREE.CatmullRomCurve3(points,true)
const pathgeometry=new THREE.BufferGeometry().setFromPoints(path.getPoints(50))
const pathmat=new THREE.LineBasicMaterial({color:false,transparent:true,opacity:0})
const pathobj=new THREE.Line(pathgeometry,pathmat)

document.getElementById('button').onclick = checkinput
function checkinput() {
	if (document.getElementById('input').value) {
		init()
	}
}

function init() {
	document.getElementById('intro').style.display = 'none'
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//lights
	lights.defaultLight = addLight()

	scene.add(lights.defaultLight)
	scene.add(pathobj)

	resize()
	translateToMorse()
	animate()
	setBg()
}

function translateToMorse() {
	let user = document.getElementById('input').value
	if (user.length > 0) {
		let userText
		if (user.indexOf(' ') !== -1) {
			//has white space
			userText = user.split(' ')
			let userText2 = []
			let userMorse = []
			for (let i = 0; i < userText.length; i++) {
				userText2.push(userText[i].split(''))
				tempArr[i] = new THREE.Group()
				for (let j = 0; j < userText2[i].length; j++) {
					userMorse.push([translation(userText2[i][j])])
					checkSpaces(
						userMorse[userMorse.length - 1],
						true,
						tempArr[i]
					)
				}
			}
		} else {
			userText = user.split('')
			tempArr[0] = new THREE.Group()
			let userMorse = []
			for (let i = 0; i < userText.length; i++) {
				userMorse.push(translation(userText[i]))
			}
			checkSpaces(userMorse, false, tempArr[0])
		}
	}

	let currPosition = 0
	for (let i = 0; i < tempArr.length; i++) {
		if (i == 0) {
			let size = tempArr[0].children.reduce(
				(currentPosition, currentElement) => {
					if (currentElement.userData.name === 'dot') {
						currentPosition += 2
					} else {
						currentPosition += 3
					}
					currentPosition++
					currentElement.position.x = currentPosition
					return currentPosition
				},
				0
			)
			currPosition += size + 5
		} else {
			let size = tempArr[i].children.reduce(
				(currentPosition, currentElement) => {
					if (currentElement.userData.name === 'dot') {
						currentPosition += 2
					} else {
						currentPosition += 3
					}
					currentPosition++
					currentElement.position.x = currentPosition
					return currentPosition
				},
				0
			)
			tempArr[i].position.x = currPosition
			currPosition += size + 5
		}
	}

	setTimeout(scrunch, 1000)
}

function scrunch() {
	const yOffset=5-(((tempArr[1].children.length-1)/2)**2)

	let tl=gsap.timeline({repeat:-1})
	for (let i=0;i<tempArr[1].children.length;i++){
		let xpos=tempArr[1].children[i].position.x-=1
		console.log("after")
		tl.to(tempArr[1].children[i].position,{
			y:5-((i-(tempArr[1].children.length-1)/2)**2)-yOffset,
			duration: 1,
			ease: 'power1.inOut'
		},"-=0.85")
	}
	for (let i=0;i<tempArr[1].children.length;i++){
		let xpos=tempArr[1].children[i].position.x-=1
		console.log("after")
		tl.to(tempArr[1].children[i].position,{
			y:0,
			duration: 1,
			ease: 'power1.inOut'
		},"-=0.85")
	}	
}

function scrunchOut() {
	
	for (let i=0;i<tempArr[1].children.length;i++){
		gsap.to(tempArr[1].children[i].position,{
			// x: (tempArr[1].children[i].position.x -= 2),
			y:0,
			duration: 3,
			ease: 'power1.inOut',
		})
		// console.log(tempArr[1].children[i].position)
		// console.log(tempArr[1].children[i].position.y)
	}
	gsap.to(tempArr[0].position, {
		x: (tempArr[0].position.x -= 2),
		duration: 3,
		ease: 'power1.inOut',
		// onComplete: scrunchOut,
	},)
	gsap.to(tempArr[1].position, {
		x: (tempArr[1].position.x -= 2),
		y: 0,
		duration: 3,
		ease: 'power1.inOut',
		// onComplete: scrunchIn,
	})
	console.log(tempArr[1].position)
	setTimeout(scrunchIn,3000)
}

function checkSpaces(mArray, hasSpace, group) {
	let pickmat=Math.floor(Math.random()*4)
	translateToMesh(mArray, group,pickmat)
}

window.addEventListener('click', function () {
	// console.log(tempArr)
	// tempArr[0].position.x+=0.5
})

function translateToMesh(mArray, group,check) {
	let count = 0

	for (let i = 0; i < mArray.length; i++) {
		let charMorse = mArray[i].split('')
		for (let j = 0; j < charMorse.length; j++) {
			if (charMorse[j] == '.') {
				let temp
				if (check==0){
					temp = randomAll()
				}else{
					temp=randomGroup()
				} 
				meshes['letter' + i + '-dot' + j] = addDot(temp)
				group.add(meshes['letter' + i + '-dot' + j])
				scene.add(group)

			} else if (charMorse[j] == '-') {
				let temp
				if (check==0){
					temp = randomAll()
				}else{
					temp=randomGroup()
				} 
				meshes['letter' + i + '-dash' + j] = addDash(temp)
				group.add(meshes['letter' + i + '-dash' + j])
				scene.add(group)

			}
		}

		count++
	}
	// console.log(getSize(group))
}

function getSize(_group) {
	// console.log('called')
	let size = 0
	_group.children.forEach((child) => {
		if (child.userData.name === 'dot') {
			size += 2
		} else {
			size += 3
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

	const time=Date.now()
	const t=(time/2000%6)/6
	// console.log(t)

	const delays = [0, 0.2, 0.4]

    tempArr.forEach((group, index) => {
        
        group.children.forEach(child => {
			const t = ((time / 2000 + delays[index]) % 6) / 6
        
			const position = path.getPointAt(t);
			group.position.copy(position);
			// const tangent = path.getTangentAt(t).normalize();

            // child.lookAt(position.clone().add(tangent));
        });
    });
	

	// const delta = clock.getDelta()
	// const position=path.getPointAt(t)
	// tempArr[0].position.copy(position)
	// tempArr[1].position.copy(position)
	// tempArr[2].position.copy(position)

	// const tangent=path.getTangentAt(t).normalize()
	// for(let i=0;i<tempArr.length;i++){
	// 	for(let j=0;j<tempArr[i].children.length;j++){
	// 		// tempArr[i].children[j].lookAt(position.clone().add(tangent))
			
	// 	}
	// }
	// tempArr[0].lookAt(position.clone().add(tangent))
	// tempArr[1].lookAt(position.clone().add(tangent))
	// tempArr[2].lookAt(position.clone().add(tangent))

	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}