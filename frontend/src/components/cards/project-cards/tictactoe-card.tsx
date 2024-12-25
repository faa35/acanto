import Image from "next/image"
import { Badge } from "../../shadcn/Badge";
import SendmessageIcon from "../../lottie-ui/send-message";
import CardWrapper from "../card-wrapper";

const Tictactoe = () => {
  return (
    <CardWrapper>
      <div className="relative h-full flex flex-col justify-center gap-6 py-4 sm:py-6 px-4 sm:px-8 overflow-hidden">
        <div className="relative flex justify-between w-full h-full items-stretch flex-col">
          <div className="absolute h-full w-full aspect-[578/433] shadow-2xl rounded-lg">
            <Image
              src={"/projects/tictactoe.png"}
              alt={"Developer landing page example"}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>
          <div className="flex flex-col items-start gap-1">
            <h4 className="text-xs font-medium opacity-80 uppercase flex flex-wrap gap-2 items-center">
              <span>Project at</span>
              <span className="flex gap-1">
                <Image
                  src="/companies/SFU-block-logo.svg.png"
                  alt="SFU logo"
                  height={20}
                  width={32}
                />
                Simon Fraser University
              </span>
            </h4>
            <div className="w-full flex gap-2 items-center">
              <h1 className="text-2xl font-medium dark:text-white text-black uppercase opacity-90">
                TicTacToe with Adversarial Search
              </h1>
              <SendmessageIcon link="https://github.com/faa35/A2-AI" lottieName="DeveloperLandingIcon" />
            </div>
            <div className="flex gap-2 flex-wrap mt-1">
              <Badge variant="default" className="text-xs">
                Python
              </Badge>
              <Badge variant="default" className="text-xs">
                Numpy
              </Badge>
              <Badge variant="default" className="text-xs">
                Tkinter
              </Badge>
              <Badge variant="default" className="text-xs">
                Adversarial Search
              </Badge>
              <Badge variant="default" className="text-xs">
                MinMax
              </Badge>
              <Badge variant="default" className="text-xs">
                Alpha-Beta Pruning
              </Badge>
              <Badge variant="default" className="text-xs">
                Monte Carlo Tree Search (MCTS)
              </Badge>


            </div>
          </div>
      </div>
    </CardWrapper>
  )
}

export default Tictactoe
