import storageController from 'infinitymint-client/dist/src/classic/storageController';
import controller from 'infinitymint-client/dist/src/classic/controller';
export * from 'infinitymint-client/dist/src/classic/helpers';

export const createNewTempProject = (projectName) => {
    storageController.setGlobalPreference('tempProject', projectName);
    storageController.saveData();

    if (
        storageController.getGlobalPreference('_projects') &&
        storageController.getGlobalPreference('_projects')[projectName]
    )
        return storageController.getGlobalPreference('_projects')[projectName];

    let project = controller.getProjectSettings();

    storageController.setGlobalPreference('_projects', {
        ...(storageController.getGlobalPreference('_projects') || {}),
        [projectName]: {
            ...project,
        },
    });
    storageController.saveData();

    return project;
};
