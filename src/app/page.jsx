import NavBar from "@/components/NavBar";


export default function Home() {
	return (
		<>
			{/* Title bar */}
			<div id='title'>
				{/* Title bar - first part */}
				<div id="first">
					<h1 className='name'>VALENTINA</h1>
					
					<div className='frontPart'/>
					<div className='backPart'/>
				</div>


				{/* Title bar - last part */}
				<div id="last">
					<h1 className='name'>BANNER</h1>
					
					<div className='frontPart'/>
					<div className='backPart'/>
				</div>
			</div>

			{/* Nav Bar */}
			<NavBar homePage={true}/>
		</>
	);
}
