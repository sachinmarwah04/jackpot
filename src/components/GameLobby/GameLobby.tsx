"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";
import { useGames } from "@/hooks/useGames";
import { useGameSearch } from "@/hooks/useGameSearch";
import { useDebounce } from "@/hooks/useDebounce";
import GameCard, { GameCardSkeleton } from "@/components/GameCard/GameCard";
import GameRow from "@/components/GameRow/GameRow";
import SearchBar from "@/components/SearchBar/SearchBar";
import Filters from "@/components/Filters/Filters";
import FlyingHeartLayer from "@/components/FlyingHeart/FlyingHeart";
import { GAME_SECTIONS, type GameSection } from "@/types/game";
import styles from "./GameLobby.module.scss";

const GRID_SKELETONS = 18;

export default function GameLobby() {
  const {
    searchQuery,
    activeTab,
    activeSection,
    activeVendor,
    setSearchQuery,
    setActiveTab,
    setActiveSection,
    setActiveVendor,
    favoriteGames,
  } = useGameStore();

  const isFavoritesTab = activeTab === "favorites";

  const debouncedSearch = useDebounce(searchQuery, 300);
  const isSearching = debouncedSearch.trim().length > 0;

  // ── Tab click: scroll to section or filter ──
  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      setActiveSection(null);
      setSearchQuery("");
      if (tabId) {
        const section = GAME_SECTIONS.find((s) => s.id === tabId);
        if (section) {
          setTimeout(() => {
            document
              .getElementById(tabId)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }
      }
    },
    [setActiveTab, setActiveSection, setSearchQuery],
  );

  // ── View All ──
  const handleViewAll = useCallback(
    (section: GameSection) => {
      setActiveSection(section);
      setSearchQuery("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setActiveSection, setSearchQuery],
  );

  // ── Sections to display ──
  const visibleSections = useMemo(() => {
    if (!activeTab) return GAME_SECTIONS;
    return GAME_SECTIONS.filter((s) => s.id === activeTab);
  }, [activeTab]);

  const isBrowsingSection = !debouncedSearch.trim() && activeSection !== null;
  const isVendorFiltered =
    !!activeVendor && !debouncedSearch.trim() && !isBrowsingSection;

  // ── Infinite query for view-all and search grid ──
  const browseParams = useMemo(() => {
    if (isVendorFiltered) return { vendor: activeVendor };
    return {
      ...(activeSection?.params ?? {}),
      ...(activeVendor ? { vendor: activeVendor } : {}),
    };
  }, [activeSection, activeVendor, isVendorFiltered]);

  const {
    data: browseData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isBrowseLoading,
    isError: isBrowseError,
  } = useGames(browseParams);

  const browseGames = useMemo(
    () => browseData?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [browseData],
  );

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useGameSearch(debouncedSearch);

  const searchGames = useMemo(() => searchData?.data.items ?? [], [searchData]);

  // ── Infinite scroll sentinel (grid view) ──
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleSentinel = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    if (!isBrowsingSection) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleSentinel, {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isBrowsingSection, handleSentinel]);

  // ── Grid content to show ──
  const gridGames = isSearching ? searchGames : browseGames;
  const gridLoading = isSearching ? isSearchLoading : isBrowseLoading;
  const gridError = isSearching ? isSearchError : isBrowseError;
  const browseTotal = browseData?.pages[0]?.data.total ?? 0;

  const showGrid = isSearching || isBrowsingSection || isVendorFiltered;
  const showFavorites = isFavoritesTab && !isSearching;

  return (
    <div className={styles.lobby}>
      <FlyingHeartLayer />
      <div className={styles.inner}>
        {/* ── Promotional banner ────────────── */}
        <div className={styles.promoBanner}>
          <Image
            src="/banner/jackpot-airdrop-banner.png"
            alt="$JACKPOT Airdrop"
            width={387}
            height={187}
            className={styles.promoImg}
          />
        </div>

        {/* ── Category tabs + search ─────────── */}
        <div className={styles.controls}>
          <SearchBar
            value={searchQuery}
            onChange={(q) => {
              setSearchQuery(q);
              if (q) {
                setActiveSection(null);
                setActiveTab("");
              }
            }}
          />
          <Filters
            activeTab={activeTab}
            onTabChange={handleTabChange}
            activeVendor={activeVendor}
            onVendorChange={setActiveVendor}
          />
        </div>

        {/* ── FAVORITES GRID ───────────────────── */}
        {showFavorites && (
          <>
            <div className={styles.gridHeader}>
              <h2 className={styles.gridTitle}>♥ Favorites</h2>
            </div>
            <div className={styles.grid}>
              {favoriteGames.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>♡</span>
                  <p className={styles.emptyTitle}>No favorites yet</p>
                  <p className={styles.emptyText}>
                    Hover a game card and tap the heart to save it here.
                  </p>
                </div>
              ) : (
                favoriteGames.map((game) => (
                  <div key={game.slug} className={styles.gridCard}>
                    <GameCard game={game} />
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── GRID VIEW (search or view-all) ─── */}
        {showGrid && !showFavorites && (
          <>
            <div className={styles.gridHeader}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => {
                  setActiveSection(null);
                  setActiveVendor("");
                  setSearchQuery("");
                }}
              >
                <Image src="/icons/chevron-left.svg" width={8} height={14} alt="" unoptimized />
                Back
              </button>
              <h2 className={styles.gridTitle}>
                {isSearching
                  ? `Results for "${debouncedSearch}"`
                  : isVendorFiltered
                    ? activeVendor
                    : activeSection?.label}
              </h2>
            </div>

            <div className={styles.grid}>
              {gridLoading &&
                Array.from({ length: GRID_SKELETONS }).map((_, i) => (
                  <div key={i} className={styles.gridCard}>
                    <GameCardSkeleton />
                  </div>
                ))}

              {gridError && !gridLoading && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>⚠️</span>
                  <p className={styles.emptyTitle}>Failed to load games</p>
                  <p className={styles.emptyText}>Please try again.</p>
                </div>
              )}

              {!gridLoading && !gridError && gridGames.length === 0 && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <p className={styles.emptyTitle}>No games found</p>
                  <p className={styles.emptyText}>
                    {isSearching
                      ? `Nothing matches "${debouncedSearch}".`
                      : "No games in this section."}
                  </p>
                </div>
              )}

              {!gridLoading &&
                gridGames.map((game) => (
                  <div key={game.slug} className={styles.gridCard}>
                    <GameCard game={game} />
                  </div>
                ))}

              {isFetchingNextPage &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={`more-${i}`} className={styles.gridCard}>
                    <GameCardSkeleton />
                  </div>
                ))}

              {!isSearching && browseGames.length > 0 && (
                <p className={styles.countText}>
                  {browseGames.length} of {browseTotal} games
                </p>
              )}

              <div
                ref={sentinelRef}
                className={styles.sentinel}
                aria-hidden="true"
              />
            </div>
          </>
        )}

        {/* ── SECTIONS LAYOUT (default) ──────── */}
        {!showGrid && !showFavorites && visibleSections.length > 0 && (
          <div className={styles.sections}>
            {visibleSections.map((section) => (
              <GameRow
                key={section.id}
                section={section}
                onViewAll={handleViewAll}
              />
            ))}
          </div>
        )}

        {/* ── COMING SOON (tab active but no section exists e.g. Live Dealer) ── */}
        {!showGrid &&
          !showFavorites &&
          activeTab &&
          visibleSections.length === 0 && (
            <div className={styles.comingSoon}>
              <Image
                src="/icons/airdrop.svg"
                width={64}
                height={64}
                alt=""
                aria-hidden="true"
                unoptimized
                className={styles.comingSoonIcon}
              />
              <p className={styles.comingSoonTitle}>Jackpot Airdrop Coming Soon</p>
              <p className={styles.comingSoonText}>
                This section is under construction. Check back soon!
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
