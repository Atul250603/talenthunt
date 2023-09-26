import instagram from '../images/instagram.png';
import linkedin from '../images/linkedin.png';
import mail from '../images/mail.png';
import github from '../images/github.png';
function Footer(){
    return(
        <div className='bg-purple-600 px-3 py-3 text-center'>
            <div className='brandname text-3xl text-white'>talentX</div>
            <div className='py-3 text-xl text-white tagline'>Find. Collaborate. Succeed.</div>
            <div className='flex socials gap-3 justify-center items-center py-3'>
                <a href=""><img src={linkedin} alt="socials"/></a>
                <a href=""><img src={instagram} alt="socials"/></a>
                <a href=""><img src={github} alt="socials"/></a>
                <a href=""><img src={mail} alt="socials"/></a>
            </div>
        </div>
    )
}
export default Footer;