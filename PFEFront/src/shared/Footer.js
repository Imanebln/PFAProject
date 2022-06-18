import './sharedStyling.css'
const Footer = () => {

	return (
		<div className="container">
			Copyright © <small>{new Date().getFullYear()}</small> PFEProgress{" "}
		</div>
	);
};

export default Footer;
