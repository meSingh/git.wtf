@if ($paginator->hasPages())
    <ul class="pagination list-reset flex flex-row justify-between h-10 mt-12 mb-4">
        {{-- Previous Page Link --}}
        @if ($paginator->onFirstPage())
            <li class="disabled text-lg rounded-md no-underline px-4 py-2 text-sm font-semibold text-grey-darker mr-2"><span>@lang('pagination.previous')</span></li>
        @else
            <li class="text-lg"><a class="bg-white rounded-md no-underline px-4 py-2 font-semibold text-grey-darker mr-2 hover:text-purple block" href="{{ $paginator->previousPageUrl() }}" rel="prev">@lang('pagination.previous')</a></li>
        @endif

        {{-- Next Page Link --}}
        @if ($paginator->hasMorePages())
            <li class="text-lg"><a class="bg-white rounded-md no-underline px-4 py-2 font-semibold text-grey-darker hover:text-purple block" href="{{ $paginator->nextPageUrl() }}" rel="next">@lang('pagination.next')</a></li>
        @else
            <li class="disabled text-lg rounded-md no-underline px-4 py-2 text-sm font-semibold text-grey-darker"><span>@lang('pagination.next')</span></li>
        @endif
    </ul>
@endif
