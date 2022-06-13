import './sharedStyling.css'
const Footer = () => {
	const link = "https://henok.us";
	const target = "_blank";

	return (
		<div className="container">
			Copyright © <small>{new Date().getFullYear()}</small> PFEProgress{" "}
		</div>
	);
};

export default Footer;
