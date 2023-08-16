import { ProjectsPage } from '../../components/ProjectsPage/ProjectsPage';
import { parseFilterValues } from '../../hooks/useUrlFilterParams';
import { declareSsrProps } from '../../utils/declareSsrProps';
import { filtersPanelSsrInit } from '../../utils/filters';

export const getServerSideProps = declareSsrProps(
    async (props) => {
        filtersPanelSsrInit(props);

        const { ssrHelpers, query } = props;
        const preset =
            typeof query.filter === 'string' ? await ssrHelpers.filter.getById.fetch(query.filter) : undefined;
        await ssrHelpers.filter.getUserFilters.fetch();
        const goalsQuery = parseFilterValues(preset ? Object.fromEntries(new URLSearchParams(preset.params)) : query);

        await ssrHelpers.project.getAll.fetch({
            firstLevel: true,
            goalsQuery,
        });
    },
    {
        private: true,
    },
);

export default ProjectsPage;
