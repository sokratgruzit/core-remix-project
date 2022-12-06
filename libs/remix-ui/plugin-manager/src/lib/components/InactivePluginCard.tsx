import { Profile } from "@remixproject/plugin-utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-use-before-define
import React from "react";
import "../remix-ui-plugin-manager.css";
interface PluginCardProps {
  profile: Profile & {
    icon?: string;
  };
  buttonText: string;
  activatePlugin: (plugin: string) => void;
}

function InactivePluginCard({
  profile,
  buttonText,
  activatePlugin,
}: PluginCardProps) {
  return (
    <div
      className="list-group list-group-flush plugins-list-group"
      data-id="pluginManagerComponentActiveTile"
    >
      <article
        className="list-group-item py-1 mb-1 plugins-list-group-item"
        title={profile.displayName || profile.name}
      >
        <div className="remixui_row justify-content-between align-items-center mb-2">
          <h6 className="remixui_displayName plugin-name">
            <div>
              {profile.displayName || profile.name}
              {profile?.maintainedBy?.toLowerCase() == "remix" && (
                <i
                  aria-hidden="true"
                  className="px-1 text-success fas fa-check"
                  title="Verified by Remix"
                ></i>
              )}

              {profile.version &&
              profile.version.match(/\b(\w*alpha\w*)\b/g) ? (
                <small
                  title="Version Alpha"
                  className="remixui_versionWarning plugin-version"
                >
                  alpha
                </small>
              ) : profile.version &&
                profile.version.match(/\b(\w*beta\w*)\b/g) ? (
                <small
                  title="Version Beta"
                  className="remixui_versionWarning plugin-version"
                >
                  beta
                </small>
              ) : null}
            </div>
            {profile.documentation && (
              <a
                href={profile.documentation}
                className="px-1"
                title="link to documentation"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="linkDocsIcon"
                >
                  <path d="M9.16536 14.7917C9.00703 14.7917 8.8487 14.7334 8.7237 14.6084C8.48203 14.3667 8.48203 13.9667 8.7237 13.725L9.3237 13.125H5.83203C5.49036 13.125 5.20703 12.8417 5.20703 12.5C5.20703 12.1584 5.49036 11.875 5.83203 11.875H9.3237L8.7237 11.275C8.5987 11.15 8.54036 10.9917 8.54036 10.8334C8.54036 10.675 8.5987 10.5167 8.7237 10.3917C8.96536 10.15 9.36536 10.15 9.60703 10.3917L11.2737 12.0584C11.382 12.1667 11.4404 12.3084 11.4487 12.4417C11.4487 12.4834 11.4487 12.5334 11.4487 12.575C11.432 12.6917 11.382 12.8 11.2987 12.9C11.2904 12.9084 11.2737 12.925 11.2654 12.9334L9.5987 14.6C9.48203 14.7334 9.3237 14.7917 9.16536 14.7917Z" />
                  <path d="M12.5013 18.9582H7.5013C2.9763 18.9582 1.04297 17.0248 1.04297 12.4998V7.49984C1.04297 2.97484 2.9763 1.0415 7.5013 1.0415H11.668C12.0096 1.0415 12.293 1.32484 12.293 1.6665C12.293 2.00817 12.0096 2.2915 11.668 2.2915H7.5013C3.65964 2.2915 2.29297 3.65817 2.29297 7.49984V12.4998C2.29297 16.3415 3.65964 17.7082 7.5013 17.7082H12.5013C16.343 17.7082 17.7096 16.3415 17.7096 12.4998V8.33317C17.7096 7.9915 17.993 7.70817 18.3346 7.70817C18.6763 7.70817 18.9596 7.9915 18.9596 8.33317V12.4998C18.9596 17.0248 17.0263 18.9582 12.5013 18.9582Z" />
                  <path d="M18.3346 8.95841H15.0013C12.1513 8.95841 11.043 7.85007 11.043 5.00007V1.66674C11.043 1.41674 11.193 1.18341 11.4263 1.09174C11.6596 0.991739 11.9263 1.05007 12.1096 1.22507L18.7763 7.89174C18.9513 8.06674 19.0096 8.34174 18.9096 8.57507C18.8096 8.8084 18.5846 8.95841 18.3346 8.95841ZM12.293 3.17507V5.00007C12.293 7.15007 12.8513 7.70841 15.0013 7.70841H16.8263L12.293 3.17507Z" />
                </svg>
              </a>
            )}
          </h6>
        </div>
        <div className="remixui_description d-flex text-body plugin-text mb-3">
          {profile.icon ? (
            <img
              src={profile.icon}
              className="mr-1 mt-1 remixui_pluginIcon"
              alt="profile icon"
            />
          ) : null}
          <span className="remixui_descriptiontext">{profile.description}</span>
        </div>
        {
          <button
            onClick={() => {
              activatePlugin(profile.name);
            }}
            className="btn btn-secondary w-100"
            data-id={`pluginManagerComponentActivateButton${profile.name}`}
          >
            {buttonText}
          </button>
        }
      </article>
    </div>
  );
}

export default InactivePluginCard;
