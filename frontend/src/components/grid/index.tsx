"use client";

import { ReactNode } from "react";
import styles from "./grid.module.scss";
import BlurFade from "../magic-ui/blur-fade";
import {
	DiscordCard,
	LastfmCard,
	AboutCard,
	MapCard,
	ResumeCard,
	IconCard,
	GithubCard,
	ChatCard,
	ToolsCard,
	SiuuCard,
} from "@/components/cards";

// Arrangement mirrors the old site: wide intro, square tiles, two tall blank boxes.
const TILES: { area: string; delay: number; node: ReactNode }[] = [
	{ area: "about", delay: 0.02, node: <AboutCard /> },
	{ area: "resume", delay: 0.06, node: <ResumeCard /> },
	{ area: "empty1", delay: 0.1, node: <SiuuCard /> },
	{ area: "discord", delay: 0.14, node: <DiscordCard /> },
	{ area: "map", delay: 0.18, node: <MapCard /> },
	{ area: "empty2", delay: 0.22, node: <ChatCard /> },
	{ area: "spotify", delay: 0.26, node: <LastfmCard /> },
	{ area: "linkedin", delay: 0.3, node: <IconCard title="Linkedin" link="https://www.linkedin.com/in/fardin-abdulla/" /> },
	{ area: "github", delay: 0.34, node: <GithubCard link="https://github.com/faa35" /> },
	{ area: "tools", delay: 0.38, node: <ToolsCard /> },
	{ area: "instagram", delay: 0.42, node: <IconCard title="Instagram" link="https://www.instagram.com/acanto_abdulla/" /> },
];

const Grid = () => {
	return (
		<div className={styles.homeWrap}>
			<main className={styles.home}>
				{TILES.map((t) => (
					<div key={t.area} data-area={t.area} className={styles.tile} style={{ gridArea: t.area }}>
						<BlurFade delay={t.delay} yOffset={20} blur="6px">
							{t.node}
						</BlurFade>
					</div>
				))}
			</main>
		</div>
	);
};

export default Grid;
