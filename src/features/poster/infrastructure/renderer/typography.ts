import { formatCoordinates } from "@/shared/geo/posterBounds";
import type { Coordinate } from "@/shared/geo/types";
import { APP_CREDIT_URL, APP_CREDIT_TEXT, OSM_ATTRIBUTION_TEXT, USE_LOGO_BADGES } from "@/core/config";
import {
  TEXT_DIMENSION_REFERENCE_PX,
  TEXT_CITY_Y_RATIO,
  TEXT_DIVIDER_Y_RATIO,
  TEXT_COUNTRY_Y_RATIO,
  TEXT_COORDS_Y_RATIO,
  TEXT_EDGE_MARGIN_RATIO,
  CITY_FONT_BASE_PX,
  COUNTRY_FONT_BASE_PX,
  COORDS_FONT_BASE_PX,
  ATTRIBUTION_FONT_BASE_PX,
  isLatinScript,
  formatCityLabel,
  computeCityFontScale,
  computeAttributionColor,
} from "@/features/poster/domain/textLayout";

function drawLogoBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number,
  isOsm: boolean,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;

  const radius = size * 0.15;
  const badgeWidth = size * (isOsm ? 2.0 : 1.1);
  const badgeHeight = size * 0.6;

  ctx.beginPath();
  ctx.roundRect(x, y - badgeHeight, badgeWidth, badgeHeight, radius);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "white";
  if (isOsm) {
    ctx.beginPath();
    ctx.moveTo(x + badgeWidth * 0.25, y - badgeHeight * 0.3);
    ctx.lineTo(x + badgeWidth * 0.4, y - badgeHeight * 0.5);
    ctx.lineTo(x + badgeWidth * 0.5, y - badgeHeight * 0.3);
    ctx.lineTo(x + badgeWidth * 0.45, y - badgeHeight * 0.3);
    ctx.lineTo(x + badgeWidth * 0.45, y - badgeHeight * 0.45);
    ctx.lineTo(x + badgeWidth * 0.4, y - badgeHeight * 0.4);
    ctx.lineTo(x + badgeWidth * 0.25, y - badgeHeight * 0.3);
    ctx.fill();
  } else {
    const tx = x + badgeWidth * 0.15;
    const ty = y - badgeHeight * 0.3;
    const ts = size * 0.2;
    ctx.beginPath();
    ctx.roundRect(tx, ty - ts * 0.5, ts, ts, 4);
    ctx.fill();
  }

  ctx.restore();
}

export function drawPosterText(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: { ui?: { text?: string } },
  center: Coordinate,
  city: string,
  country: string,
  fontFamily: string | undefined,
  showPosterText: boolean,
  showOverlay: boolean,
  includeCredits: boolean = true,
): void {
  const textColor = theme.ui?.text || "#111111";
  const landColor = theme.map?.land || "#808080";
  const attributionColor = computeAttributionColor(textColor, landColor, showOverlay);
  const attributionAlpha = showOverlay ? 0.55 : 0.9;
  const titleFontFamily = fontFamily
    ? `"${fontFamily}", "Space Grotesk", sans-serif`
    : '"Space Grotesk", sans-serif';
  const bodyFontFamily = fontFamily
    ? `"${fontFamily}", "IBM Plex Mono", monospace`
    : '"IBM Plex Mono", monospace';

  const dimScale = Math.max(
    0.45,
    Math.min(width, height) / TEXT_DIMENSION_REFERENCE_PX,
  );
  const attributionFontSize = ATTRIBUTION_FONT_BASE_PX * dimScale;
  const logoBadgeSize = attributionFontSize;

  if (showPosterText) {
    const cityLabel = formatCityLabel(city);
    const cityFontSize = CITY_FONT_BASE_PX * dimScale * computeCityFontScale(city);

    const countryFontSize = COUNTRY_FONT_BASE_PX * dimScale;
    const coordinateFontSize = COORDS_FONT_BASE_PX * dimScale;
    const cityY = height * TEXT_CITY_Y_RATIO;
    const lineY = height * TEXT_DIVIDER_Y_RATIO;
    const countryY = height * TEXT_COUNTRY_Y_RATIO;
    const coordinatesY = height * TEXT_COORDS_Y_RATIO;

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${cityFontSize}px ${titleFontFamily}`;
    ctx.fillText(cityLabel, width * 0.5, cityY);

    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3 * dimScale;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, lineY);
    ctx.lineTo(width * 0.6, lineY);
    ctx.stroke();

    ctx.font = `300 ${countryFontSize}px ${titleFontFamily}`;
    ctx.fillText(country.toUpperCase(), width * 0.5, countryY);

    ctx.globalAlpha = 0.75;
    ctx.font = `400 ${coordinateFontSize}px ${bodyFontFamily}`;
    ctx.fillText(
      formatCoordinates(center.lat, center.lon),
      width * 0.5,
      coordinatesY,
    );
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = attributionColor;
  ctx.globalAlpha = attributionAlpha;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.font = `300 ${attributionFontSize}px ${bodyFontFamily}`;
  ctx.fillText(
    "\u00a9 OpenStreetMap contributors",
    width * (1 - TEXT_EDGE_MARGIN_RATIO),
    height * (1 - TEXT_EDGE_MARGIN_RATIO),
  );
  ctx.globalAlpha = 1;

  if (includeCredits) {
    ctx.fillStyle = attributionColor;
    ctx.globalAlpha = attributionAlpha;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.font = `300 ${attributionFontSize}px ${bodyFontFamily}`;
    ctx.fillText(
      `© ${APP_CREDIT_URL}`,
      width * TEXT_EDGE_MARGIN_RATIO,
      height * (1 - TEXT_EDGE_MARGIN_RATIO),
    );
    ctx.globalAlpha = 1;
  }

  if (USE_LOGO_BADGES) {
    // Draw logos with badges instead of plain text
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    const xRight = width * (1 - TEXT_EDGE_MARGIN_RATIO);
    const yBottom = height * (1 - TEXT_EDGE_MARGIN_RATIO);

    // OSM logo badge
    drawLogoBadge(ctx, xRight - logoBadgeSize * 0.1, yBottom, logoBadgeSize, attributionColor, attributionAlpha, true);

    // Text label
    ctx.fillStyle = attributionColor;
    ctx.globalAlpha = attributionAlpha;
    ctx.font = `300 ${attributionFontSize * 0.55}px ${bodyFontFamily}`;
    ctx.fillText(
      OSM_ATTRIBUTION_TEXT,
      xRight - logoBadgeSize * 2.0,
      yBottom - logoBadgeSize * 0.15
    );
    ctx.globalAlpha = 1;

    if (includeCredits) {
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      const xLeft = width * TEXT_EDGE_MARGIN_RATIO;

      // App logo badge
      drawLogoBadge(ctx, xLeft, yBottom, logoBadgeSize, attributionColor, attributionAlpha, false);

      // Text label
      ctx.fillStyle = attributionColor;
      ctx.globalAlpha = attributionAlpha;
      ctx.font = `300 ${attributionFontSize * 0.55}px ${bodyFontFamily}`;
      ctx.fillText(
        `© ${APP_CREDIT_TEXT}`,
        xLeft + logoBadgeSize * 1.1,
        yBottom - logoBadgeSize * 0.15
      );
      ctx.globalAlpha = 1;
    }
  } else {
    // Original text-only mode
    ctx.fillStyle = attributionColor;
    ctx.globalAlpha = attributionAlpha;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.font = `300 ${attributionFontSize}px ${bodyFontFamily}`;
    ctx.fillText(
      `© ${OSM_ATTRIBUTION_TEXT}`,
      width * (1 - TEXT_EDGE_MARGIN_RATIO),
      height * (1 - TEXT_EDGE_MARGIN_RATIO),
    );
    ctx.globalAlpha = 1;

    if (includeCredits) {
      ctx.fillStyle = attributionColor;
      ctx.globalAlpha = attributionAlpha;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.font = `300 ${attributionFontSize}px ${bodyFontFamily}`;
      ctx.fillText(
        `© ${APP_CREDIT_TEXT}`,
        width * TEXT_EDGE_MARGIN_RATIO,
        height * (1 - TEXT_EDGE_MARGIN_RATIO),
      );
      ctx.globalAlpha = 1;
    }
  }
}
