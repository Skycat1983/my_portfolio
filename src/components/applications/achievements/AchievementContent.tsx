import { useNewStore } from "@/hooks/useStore";
import { WEB_PAGE_REGISTRY } from "@/components/applications/browser/browserConstants";
import ACHIEVEMENT from "@/assets/icons_m/achievement.png";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const AchievementContent = () => {
  const clickOnSomethingAchieved = useNewStore(
    (state) => state.clickOnSomethingAchieved
  );
  const accessAchievements = useNewStore((state) => state.accessAchievements);
  const downloadEggsAchieved = useNewStore(
    (state) => state.downloadEggsAchieved
  );
  const eggsDownloaded = useNewStore((state) => state.eggsDownloaded);
  const portfolioDeletedAchieved = useNewStore(
    (state) => state.portfolioDeletedAchieved
  );
  const operatingSystemSwitchedAchieved = useNewStore(
    (state) => state.operatingSystemSwitchedAchieved
  );
  const cvCheckedOut = useNewStore((state) => state.cvCheckedOut);
  const recommendationCheckedOut = useNewStore(
    (state) => state.recommendationCheckedOut
  );
  const prospectiveEmployerAchieved = useNewStore(
    (state) => state.prospectiveEmployerAchieved
  );
  const visitEveryWebsiteAchieved = useNewStore(
    (state) => state.visitEveryWebsiteAchieved
  );
  const websitesVisited = useNewStore((state) => state.websitesVisited);

  const prospectiveEmployerProgress =
    cvCheckedOut && recommendationCheckedOut
      ? 2
      : cvCheckedOut || recommendationCheckedOut
      ? 1
      : 0;

  // Define all achievements with their current status
  const achievements: Achievement[] = [
    {
      id: "first-click",
      title: "Feature Awareness Nudge",
      description: "That click didn't go unnoticed",
      icon: "👆",
      unlocked: clickOnSomethingAchieved,
    },
    {
      id: "access-achievements",
      title: "Investigate the Red Notification",
      description: "You were successfully manipulated 👍",
      icon: "🏆",
      unlocked: accessAchievements,
    },
    {
      id: "os-switcher",
      title: "OS Explorer",
      description: "Switch between operating systems",
      icon: "💻",
      unlocked: operatingSystemSwitchedAchieved,
    },
    {
      id: "egg-collector",
      title: "Egg Collector",
      description: "Download 12 eggs",
      icon: "🥚",
      unlocked: downloadEggsAchieved,
      progress: eggsDownloaded,
      maxProgress: 12,
    },
    {
      id: "prospective-employer",
      title: "Prospective Employer",
      description: "Checkout my CV and letter of recommendation",
      icon: "📄",
      unlocked: prospectiveEmployerAchieved,
      progress: prospectiveEmployerProgress,
      maxProgress: 2,
    },
    {
      id: "portfolio-destroyer",
      title: "Portfolio Destroyer",
      description: "Delete my portfolio",
      icon: "🗑️",
      unlocked: portfolioDeletedAchieved,
    },
    {
      id: "website-explorer",
      title: "Website Explorer",
      description: "Visit all available websites in the browser",
      icon: "🗺️",
      unlocked: visitEveryWebsiteAchieved,
      progress: websitesVisited.length,
      maxProgress: Object.keys(WEB_PAGE_REGISTRY).length,
    },
    {
      id: "offer-job",
      title: "Offer Job",
      description: "Offer me a job",
      icon: "💼",
      unlocked: false,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="p-6 h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <img src={ACHIEVEMENT} alt="Achievements" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            {unlockedCount}/{totalCount} Unlocked
          </div>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </div>
        </div>
      </div>

      {/* Achievement List */}
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              achievement.unlocked
                ? "bg-green-50 border-green-200 shadow-sm"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  achievement.unlocked
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {achievement.unlocked ? "🏆" : achievement.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-semibold ${
                      achievement.unlocked ? "text-green-800" : "text-gray-700"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ✓ UNLOCKED
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm ${
                    achievement.unlocked ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {achievement.description}
                </p>

                {/* Progress Bar (if applicable) */}
                {achievement.maxProgress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          achievement.unlocked ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            ((achievement.progress || 0) /
                              achievement.maxProgress) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600 text-lg">💡</span>
          <h3 className="font-semibold text-blue-800">Pro Tip</h3>
        </div>
        <p className="text-sm text-blue-700">
          Explore the desktop and interact with different elements to unlock
          more achievements! Each achievement represents a different aspect of
          the portfolio experience.
        </p>
      </div>
    </div>
  );
};
