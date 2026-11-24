"use client";

import { ReactNode, useEffect, useState } from "react";
import cn from "classnames";
import styles from "./grid.module.scss";
import {
	WidthProvider,
	ResponsiveGridLayout as Responsive,
} from "react-grid-layout-next";
import { heights, layouts } from "@/data";
import ThemeToggle from "../theme-toggle";
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
	NavBarCard,
	Footer,
	AiChatButton,
} from "@/components/cards";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Same boxes, sizes and positions as the original layout (see `layouts.all` in src/data).
const TILES: { key: string; delay: number; node: ReactNode }[] = [
	{ key: "bio", delay: 0.01, node: <AboutCard /> },
	{ key: "map", delay: 0.08, node: <MapCard /> },
	{ key: "theme-toggle", delay: 0.12, node: <ThemeToggle compact /> },
	{ key: "resume", delay: 0.1, node: <ResumeCard /> },
	{ key: "github", delay: 0.26, node: <GithubCard link="https://github.com/faa35" handle="@faa35" /> },
	{ key: "linkedin", delay: 0.24, node: <IconCard title="Linkedin" link="https://www.linkedin.com/in/fardin-abdulla/" /> },
	{ key: "codepen", delay: 0.28, node: <IconCard title="Instagram" link="https://www.instagram.com/acanto_abdulla/" /> },
	// the old Email box now lists the tools I use (email is still in the footer and "Get in touch")
	{ key: "email", delay: 0.3, node: <ToolsCard /> },
	{ key: "discord", delay: 0.35, node: <DiscordCard /> },
	{ key: "lastfm", delay: 0.4, node: <LastfmCard /> },
	// kept empty for now (Projects / Toolbox removed to keep the page calm)
	{ key: "chat-card", delay: 0.4, node: <ChatCard /> },
	{ key: "chat-card-2", delay: 0.4, node: <ChatCard /> },
];

const Grid = () => {
	const [height, setHeight] = useState(heights.lg);
	const [isMounted, setMounted] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 500);
		return () => clearTimeout(t);
	}, []);

	return (
		<div className={styles.container}>
			<NavBarCard />
			<AiChatButton />

			<ResponsiveGridLayout
				useCSSTransforms
				className={styles.layout}
				layouts={layouts.all}
				breakpoints={{
					lg: 1199,
					md: 799,
					sm: 374,
				}}
				cols={{
					lg: 12,
					md: 10,
					sm: 4,
				}}
				isDraggable={false}
				rowHeight={height}
				margin={[16, 16]}
				onBreakpointChange={(breakpoint: any) => {
					setHeight(heights[breakpoint]);
				}}
			>
				{TILES.map((t) => (
					<div
						key={t.key}
						className={cn(styles.itemGrab, styles.item)}
						style={{ transitionDuration: isMounted ? "500ms" : "0ms" }}
					>
						<BlurFade delay={t.delay}>{t.node}</BlurFade>
					</div>
				))}
			</ResponsiveGridLayout>

			<div className="px-4">
				<Footer />
			</div>
		</div>
	);
};

export default Grid;
