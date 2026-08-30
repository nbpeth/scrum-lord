import GitHubIcon from "@mui/icons-material/GitHub";
import { Link, Stack, Typography } from "@mui/material";
import {
  coffeeImageStyle,
  coffeeLinkStyle,
  footerBarSx,
  footerLinkSx,
  versionSx,
} from "./DashboardFooter.styles";

const COFFEE_BUTTON_SRC =
  "https://img.buymeacoffee.com/button-api/?text=Buy me pizza&emoji=🍕&slug=nbpetha&button_colour=BD5FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00";

const repoLinks = [
  { label: "Change log", href: "https://github.com/nbpeth/scrum-lord/releases" },
  { label: "Issues", href: "https://github.com/nbpeth/scrum-lord/issues" },
];

export const DashboardFooter = ({ version }) => (
  <Stack
    component="footer"
    direction="row"
    alignItems="center"
    justifyContent="center"
    flexWrap="wrap"
    useFlexGap
    spacing={{ xs: 2, sm: 3 }}
    sx={footerBarSx}
  >
    {version && (
      <Typography id="dashboard-version" variant="caption" sx={versionSx}>
        {version}
      </Typography>
    )}

    {repoLinks.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={footerLinkSx}
      >
        <GitHubIcon fontSize="inherit" />
        {label}
      </Link>
    ))}

    <a
      href="https://www.buymeacoffee.com/nbpetha"
      target="_blank"
      rel="noreferrer"
      style={coffeeLinkStyle}
    >
      <img alt="Buy me pizza" src={COFFEE_BUTTON_SRC} style={coffeeImageStyle} />
    </a>
  </Stack>
);
