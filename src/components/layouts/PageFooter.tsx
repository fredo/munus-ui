import { GITHUB_URL, EMAIL_URL } from "utils/urls";
import GitHubIcon from "@icons/GitHubIcon";
import EmailIcon from "@icons/EmailIcon";
import MUNUS_LOGO from "assets/munus.png";

export function PageFooter() {
  return (
    <footer>
      <div className="mx-auto pb-6 sm:max-w-3xl pt-6 px-8 lg:max-w-7xl">
        <div className="space-y-8 text-center">
          <div className="flex space-x-4 sm:space-x-6 place-content-end lg:place-content-center">
            <a href={GITHUB_URL} target="_blank">
              <GitHubIcon className={`h-6 w-6 opacity-50 hover:opacity-90 transition`}/>
            </a>
            <a href={EMAIL_URL} target="_blank">
              <EmailIcon className={`h-6 w-6 opacity-50 hover:opacity-90 transition text-zinc-100 hover:text-zinc-100`}/>
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-4 opacity-20">
        </div>
        <p className="text-base text-zinc-400 text-center font-telegrama">
          <span className="opacity-50">
            Made with love and Amstel in our blood
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 active:from-cyan-700 active:to-blue-700">
            <img src={MUNUS_LOGO} className="ml-4 mr-4 h-5 w-auto inline -mt-1.5"/>
          </span>
          <span className="opacity-50">
             MUNUS
          </span>
        </p>
      </div>
    </footer>
  );
}
